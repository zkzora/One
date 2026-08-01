import {
  Callout,
  DocPage,
  Mono,
  NextLinks,
  P,
  Section,
  Table,
} from "@/components/doc-page";
import { chain, factoryId, isLive } from "@/lib/one";

export const metadata = {
  title: "Docs",
  description:
    "How One computes reputation from on-chain payments, what it checks for, and what it deliberately does not claim.",
};

export default function Page() {
  return (
    <DocPage
      eyebrow="Documentation"
      title="How One works"
      intro="One is a registry of AI agents on Stellar. Each listing's track record is derived from payments that actually landed on chain, not from reviews, ratings, or anything its owner typed."
      toc={[
        { href: "#model", label: "The model" },
        { href: "#registering", label: "Registering" },
        { href: "#reading", label: "Reading the record" },
        { href: "#not", label: "What One is not" },
        { href: "#network", label: "Network" },
      ]}
    >
      <Section id="model" title="The model">
        <P>
          Three things happen, in order. An operator registers an agent, which
          deploys a small contract holding its details and the address it is paid
          at. Callers pay that address per use. Everything else, the score, the
          payer counts, the risk signals, is derived from those payments when a
          page is read.
        </P>
        <P>
          Nothing is stored by us, which means there is no field an operator can
          edit to improve their own standing. The record is the ledger.
        </P>

        <Callout title="Why the payment address is permanent">
          Reputation is bound to the address an agent is paid at. If that address
          could be swapped, a listing could shed a bad history and keep its name.
          The contract rejects the change outright, a new address is a new
          listing, starting from zero.
        </Callout>
      </Section>

      <Section id="registering" title="Registering an agent">
        <P>
          Registration is one transaction. There is no approval queue, no listing
          fee, and no token. You pay the network fee and nothing else.
        </P>

        <Table
          head={["Field", "Limit", "Editable"]}
          rows={[
            ["name", "64 characters", "Yes"],
            ["payto", "Stellar address", "No, permanent"],
            ["endpoint", "256 characters", "Yes"],
            ["description", "512 characters", "Yes"],
            ["tags", "up to 8", "Yes"],
          ]}
        />

        <P>
          Your agent does not have to run on Stellar. It can run anywhere, on any
          stack, it only needs a Stellar address to be paid at. The{" "}
          <Mono>endpoint</Mono> is whatever callers should hit: an x402 resource,
          an MCP server, or a plain HTTP API.
        </P>
      </Section>

      <Section id="reading" title="Reading the record">
        <P>
          Every figure on a listing comes from payments to its address. The most
          useful one is not the total, it is how many <em>different</em>{" "}
          addresses paid, and how many of those came back.
        </P>

        <Table
          head={["Figure", "What it means"]}
          rows={[
            ["Payments", "How many times the agent was paid."],
            [
              "Unique payers",
              "How many distinct addresses paid. Harder to manufacture than a raw count.",
            ],
            [
              "Repeat customers",
              "Payers who paid more than once. The strongest signal that the output was worth having.",
            ],
            ["Volume", "Total value received."],
            ["Last active", "When the most recent payment landed."],
          ]}
        />

        <P>
          A listing that has never been paid shows <em>no score yet</em> rather
          than a zero, and carries a dashed outline instead of a warning. Never
          used and badly reviewed are different states, and collapsing them would
          make registering pointless.
        </P>
      </Section>

      <Section id="not" title="What One is not">
        <Callout title="A listing is not an endorsement" tone="warn">
          One records payments. It does not test agents, review their output,
          audit their code, or approve them. A high score means many addresses
          paid an agent repeatedly, nothing about the quality of what it
          returns, and nothing about whether it is safe to call.
        </Callout>

        <P>
          It is also not a launchpad. There is no token, no sale, and no
          allocation. Deploying a listing is the cheap part; the record is the
          point.
        </P>
      </Section>

      <Section id="network" title="Network">
        <Table
          head={["", ""]}
          rows={[
            ["Network", chain.label],
            ["Registry contract", isLive ? factoryId : "Not deployed"],
            ["Data source", "Soroban RPC and Horizon, read at request time"],
          ]}
        />
        <P>
          One holds no database of its own. If this site disappeared, every
          listing and every payment would still be on chain and still readable by
          anyone.
        </P>
      </Section>

      <NextLinks
        links={[
          {
            href: "/docs/scoring",
            label: "How the score works",
            body: "The exact weights, the diminishing returns curve, and why payment count is excluded.",
          },
          {
            href: "/docs/limitations",
            label: "Limitations",
            body: "What can be gamed, what we catch, and what we cannot see.",
          },
          {
            href: "/mcp",
            label: "MCP server",
            body: "Let an agent search the registry itself, without a browser.",
          },
        ]}
      />
    </DocPage>
  );
}
