import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { computeReputation } from "./reputation";
import type { PayerOrigin, Payment } from "./types";

const DAY = 86_400;
const NOW = 1_800_000_000;
const OWNER = "GOWNER";

function pay(from: string, amount: number, daysAgo = 1): Payment {
  return { from, amount, asset: "XLM", at: NOW - daysAgo * DAY };
}

function origins(
  entries: Array<[string, Partial<PayerOrigin>]>
): Map<string, PayerOrigin> {
  return new Map(
    entries.map(([addr, o]) => [
      addr,
      { createdAt: o.createdAt ?? NOW - 365 * DAY, funder: o.funder ?? null },
    ])
  );
}

describe("no payments", () => {
  it("has no record rather than a zero score", () => {
    const r = computeReputation({ payments: [], owner: OWNER, now: NOW });

    assert.equal(r.hasRecord, false);
    assert.equal(r.score, 0);
    assert.deepEqual(r.signals, [], "an untested agent is not a flagged agent");
    assert.equal(r.firstPaymentAt, null);
  });
});

describe("metrics", () => {
  const payments = [
    pay("A", 10),
    pay("A", 20),
    pay("B", 30),
    pay("C", 40),
    pay("D", 50),
  ];

  const r = computeReputation({
    payments,
    owner: OWNER,
    origins: origins([
      ["A", {}],
      ["B", {}],
      ["C", {}],
      ["D", {}],
    ]),
    now: NOW,
  });

  it("counts payments and distinct payers separately", () => {
    assert.equal(r.payments, 5);
    assert.equal(r.uniquePayers, 4);
  });

  it("counts a repeat customer once", () => {
    assert.equal(r.repeatPayers, 1);
    assert.equal(r.repeatRate, 25);
  });

  it("sums volume and derives average and median", () => {
    assert.equal(r.volume, 150);
    assert.equal(r.averageAmount, 30);
    assert.equal(r.medianAmount, 30);
  });

  it("records the span of activity", () => {
    assert.equal(r.firstPaymentAt, NOW - DAY);
    assert.equal(r.lastPaymentAt, NOW - DAY);
  });
});

describe("concentrated", () => {
  it("fires when one address is most of the record", () => {
    const payments = [
      ...Array.from({ length: 8 }, () => pay("WHALE", 10)),
      pay("B", 10),
      pay("C", 10),
    ];
    const r = computeReputation({ payments, owner: OWNER, now: NOW });
    assert.ok(r.signals.includes("concentrated"));
  });

  it("fires when there is only one payer paying repeatedly", () => {
    const r = computeReputation({
      payments: [pay("SOLO", 10), pay("SOLO", 10)],
      owner: OWNER,
      now: NOW,
    });
    assert.ok(r.signals.includes("concentrated"));
  });

  it("stays quiet when payments are spread out", () => {
    const payments = ["A", "B", "C", "D", "E"].map((p) => pay(p, 10));
    const r = computeReputation({ payments, owner: OWNER, now: NOW });
    assert.ok(!r.signals.includes("concentrated"));
  });
});

describe("fresh payers", () => {
  it("fires when most payers were funded days before paying", () => {
    const payments = [pay("A", 10), pay("B", 10), pay("C", 10)];
    const r = computeReputation({
      payments,
      owner: OWNER,
      origins: origins([
        ["A", { createdAt: NOW - 2 * DAY }],
        ["B", { createdAt: NOW - 2 * DAY }],
        ["C", { createdAt: NOW - 400 * DAY }],
      ]),
      now: NOW,
    });
    assert.ok(r.signals.includes("fresh"));
  });

  it("stays quiet for established payers", () => {
    const payments = [pay("A", 10), pay("B", 10), pay("C", 10)];
    const r = computeReputation({
      payments,
      owner: OWNER,
      origins: origins([
        ["A", { createdAt: NOW - 400 * DAY }],
        ["B", { createdAt: NOW - 400 * DAY }],
        ["C", { createdAt: NOW - 400 * DAY }],
      ]),
      now: NOW,
    });
    assert.ok(!r.signals.includes("fresh"));
  });

  it("cannot fire when payer origins are unknown", () => {
    const payments = [pay("A", 10), pay("B", 10)];
    const r = computeReputation({ payments, owner: OWNER, now: NOW });
    assert.ok(
      !r.signals.includes("fresh"),
      "a missing lookup must not be reported as evidence"
    );
  });
});

describe("circular", () => {
  it("fires when the owner funded the payers", () => {
    const r = computeReputation({
      payments: [pay("A", 10), pay("B", 10)],
      owner: OWNER,
      origins: origins([
        ["A", { funder: OWNER }],
        ["B", { funder: "GSOMEONE" }],
      ]),
      now: NOW,
    });
    assert.ok(r.signals.includes("circular"));
  });

  it("fires when the owner paid the agent directly", () => {
    const r = computeReputation({
      payments: [pay(OWNER, 10), pay("B", 10)],
      owner: OWNER,
      now: NOW,
    });
    assert.ok(r.signals.includes("circular"));
  });

  it("stays quiet for unrelated payers", () => {
    const r = computeReputation({
      payments: [pay("A", 10), pay("B", 10)],
      owner: OWNER,
      origins: origins([
        ["A", { funder: "GX" }],
        ["B", { funder: "GY" }],
      ]),
      now: NOW,
    });
    assert.ok(!r.signals.includes("circular"));
  });
});

describe("dormant", () => {
  it("fires once nothing has happened for a quarter", () => {
    const r = computeReputation({
      payments: [pay("A", 10, 120), pay("B", 10, 130)],
      owner: OWNER,
      now: NOW,
    });
    assert.ok(r.signals.includes("dormant"));
  });

  it("stays quiet for a live record", () => {
    const r = computeReputation({
      payments: [pay("A", 10, 2), pay("B", 10, 3)],
      owner: OWNER,
      now: NOW,
    });
    assert.ok(!r.signals.includes("dormant"));
  });
});

describe("score", () => {
  const spread = (n: number, repeats = 0) => {
    const payments = Array.from({ length: n }, (_, i) => pay(`P${i}`, 10));
    for (let i = 0; i < repeats; i++) payments.push(pay(`P${i}`, 10));
    return payments;
  };

  it("rewards reach", () => {
    const few = computeReputation({ payments: spread(3), owner: OWNER, now: NOW });
    const many = computeReputation({ payments: spread(40), owner: OWNER, now: NOW });
    assert.ok(many.score > few.score);
  });

  it("rewards repeat customers", () => {
    const once = computeReputation({ payments: spread(10), owner: OWNER, now: NOW });
    const again = computeReputation({
      payments: spread(10, 8),
      owner: OWNER,
      now: NOW,
    });
    assert.ok(again.score > once.score);
  });

  it("decays with age", () => {
    const fresh = computeReputation({ payments: spread(10), owner: OWNER, now: NOW });
    const stale = computeReputation({
      payments: Array.from({ length: 10 }, (_, i) => pay(`P${i}`, 10, 60)),
      owner: OWNER,
      now: NOW,
    });
    assert.ok(stale.score < fresh.score);
  });

  it("penalises a flagged record without hiding it", () => {
    const clean = computeReputation({ payments: spread(10), owner: OWNER, now: NOW });
    const flagged = computeReputation({
      payments: spread(10),
      owner: OWNER,
      origins: origins(
        Array.from({ length: 10 }, (_, i) => [`P${i}`, { funder: OWNER }])
      ),
      now: NOW,
    });

    assert.ok(flagged.score < clean.score);
    assert.equal(flagged.payments, clean.payments, "the record itself is unchanged");
    assert.ok(flagged.signals.includes("circular"));
  });

  it("never leaves the 0–100 range", () => {
    const huge = computeReputation({
      payments: spread(500, 400),
      owner: OWNER,
      now: NOW,
    });
    assert.ok(huge.score >= 0 && huge.score <= 100);
  });
});
