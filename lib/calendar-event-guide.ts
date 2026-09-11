export type EventGuide = {
  description: string;
  usualEffect: string;
  whyTradersCare: string;
  source?: string;
  frequency?: string;
};

type GuideRule = {
  /** Case-insensitive substring match against the event title. */
  match: RegExp;
  guide: EventGuide;
};

/**
 * Expand copy for common economic releases.
 * Matched by title pattern — calendar feeds often have no detail payload.
 */
const RULES: GuideRule[] = [
  {
    match: /non-?farm|nfp|employment situation|payrolls/i,
    guide: {
      description:
        "Change in the number of employed people during the previous month, excluding the farming industry. It is one of the most closely watched US labor-market prints.",
      usualEffect:
        "Actual greater than forecast is typically good for the currency (hawkish growth/jobs).",
      whyTradersCare:
        "Strong jobs can lift rate expectations and the USD; weak jobs can support risk assets and weigh on the dollar.",
      source: "Bureau of Labor Statistics (BLS)",
      frequency: "Monthly",
    },
  },
  {
    match: /unemployment claims|jobless claims|initial claims/i,
    guide: {
      description:
        "Number of individuals who filed for unemployment insurance for the first time during the past week. A timely weekly read on labor-market stress.",
      usualEffect:
        "Actual greater than forecast is typically bad for the currency (softer labor market).",
      whyTradersCare:
        "Rising claims can cool rate-hike bets; falling claims support a resilient economy narrative.",
      source: "Department of Labor",
      frequency: "Weekly",
    },
  },
  {
    match: /unemployment rate/i,
    guide: {
      description:
        "Percentage of the labor force that is unemployed and actively seeking work.",
      usualEffect:
        "Actual greater than forecast is typically bad for the currency.",
      whyTradersCare:
        "A rising jobless rate can signal cooling demand and lower the odds of tighter policy.",
      source: "National statistics office",
      frequency: "Monthly",
    },
  },
  {
    match: /core pce|pce price/i,
    guide: {
      description:
        "Change in personal consumption prices excluding food and energy — the Fed’s preferred inflation gauge.",
      usualEffect:
        "Actual greater than forecast is typically good for the currency (hotter inflation).",
      whyTradersCare:
        "Feeds directly into Fed reaction functions and front-end rate pricing.",
      source: "Bureau of Economic Analysis (BEA)",
      frequency: "Monthly",
    },
  },
  {
    match: /\bcpi\b|consumer price/i,
    guide: {
      description:
        "Change in the price of a basket of goods and services purchased by consumers. The headline inflation print most markets react to first.",
      usualEffect:
        "Actual greater than forecast is typically good for the currency (higher inflation / tighter policy odds).",
      whyTradersCare:
        "Shapes real yields, rate-cut pricing, and risk appetite across FX, bonds, and equities.",
      source: "National statistics office / BLS",
      frequency: "Monthly",
    },
  },
  {
    match: /\bgdp\b|gross domestic/i,
    guide: {
      description:
        "Change in the inflation-adjusted value of all goods and services produced by the economy. The broadest growth scorecard.",
      usualEffect:
        "Actual greater than forecast is typically good for the currency.",
      whyTradersCare:
        "Strong growth supports hawkish policy and the currency; weak growth can boost rate-cut odds.",
      source: "National statistics office / BEA",
      frequency: "Quarterly (with revisions)",
    },
  },
  {
    match: /fomc|federal funds|rate decision|interest rate|cash rate|bank rate/i,
    guide: {
      description:
        "Announcement of the central bank’s policy rate decision and often an accompanying statement on the outlook.",
      usualEffect:
        "A higher-than-expected rate (or hawkish tone) is typically good for the currency.",
      whyTradersCare:
        "Sets the short-term interest-rate path — the primary driver of FX and front-end yields.",
      source: "Central bank",
      frequency: "Scheduled meeting cycle",
    },
  },
  {
    match: /retail sales/i,
    guide: {
      description:
        "Change in the total value of sales at the retail level. A key proxy for consumer spending.",
      usualEffect:
        "Actual greater than forecast is typically good for the currency.",
      whyTradersCare:
        "Consumer spending is a large share of GDP — surprises move growth and inflation expectations.",
      source: "Census Bureau / national stats",
      frequency: "Monthly",
    },
  },
  {
    match: /durable goods/i,
    guide: {
      description:
        "Change in the total value of new orders placed with manufacturers for durable goods lasting three years or more.",
      usualEffect:
        "Actual greater than forecast is typically good for the currency.",
      whyTradersCare:
        "Signals business investment and manufacturing momentum ahead of broader growth data.",
      source: "Census Bureau",
      frequency: "Monthly",
    },
  },
  {
    match: /personal (income|spending)/i,
    guide: {
      description:
        "Change in personal income or consumer spending. Spending feeds GDP; income supports future demand.",
      usualEffect:
        "Stronger-than-expected spending/income is typically good for the currency.",
      whyTradersCare:
        "Helps confirm whether consumers can keep driving growth without stoking inflation.",
      source: "Bureau of Economic Analysis (BEA)",
      frequency: "Monthly",
    },
  },
  {
    match: /consumer (confidence|sentiment)|ifo business|pmi|ism /i,
    guide: {
      description:
        "Survey-based measure of business or consumer optimism about current and future conditions.",
      usualEffect:
        "Actual greater than forecast is typically good for the currency.",
      whyTradersCare:
        "Soft data often leads hard data — swings can reprice growth expectations quickly.",
      source: "Survey provider (Conference Board, S&P, etc.)",
      frequency: "Monthly",
    },
  },
  {
    match: /crude oil|oil inventori|eia |api weekly|natural gas storage/i,
    guide: {
      description:
        "Weekly change in energy inventories. A supply/demand pulse for oil or natural gas markets.",
      usualEffect:
        "Larger-than-expected builds (more supply) typically weigh on energy prices.",
      whyTradersCare:
        "Moves oil, related FX (CAD, NOK), and inflation expectations at the margin.",
      source: "EIA / API",
      frequency: "Weekly",
    },
  },
  {
    match: /jackson hole|speaks|speech|testimony|symposium/i,
    guide: {
      description:
        "Scheduled remarks from a policymaker or a major policy conference. Tone can matter more than any single data print.",
      usualEffect:
        "Hawkish comments typically support the currency; dovish comments typically weigh on it.",
      whyTradersCare:
        "Can reprice the entire rate path in minutes when guidance shifts.",
      source: "Central bank / conference host",
      frequency: "As scheduled",
    },
  },
  {
    match: /trade balance|current account/i,
    guide: {
      description:
        "Difference between a country’s exports and imports of goods (and sometimes services), or the broader current-account balance.",
      usualEffect:
        "A larger surplus (or smaller deficit) than forecast is typically good for the currency.",
      whyTradersCare:
        "Affects FX flows and perceptions of external balance resilience.",
      source: "National statistics office",
      frequency: "Monthly / quarterly",
    },
  },
  {
    match: /building permits|housing starts|home sales|hpi\b|house price/i,
    guide: {
      description:
        "Measure of housing activity or residential price inflation — permits, starts, sales, or price indexes.",
      usualEffect:
        "Stronger housing data is typically good for the currency and risk appetite.",
      whyTradersCare:
        "Housing is rate-sensitive; prints influence views on the consumer and the policy path.",
      source: "Census / national housing agency",
      frequency: "Monthly",
    },
  },
];

const FALLBACK: EventGuide = {
  description:
    "Scheduled economic or policy release. Compare the actual print with the forecast and previous reading for the surprise.",
  usualEffect:
    "A stronger-than-expected print is often supportive for the related currency; a miss can weigh on it. Direction depends on whether the market prices growth or inflation risk.",
  whyTradersCare:
    "High- and medium-impact events can reprice rates, FX, and risk assets around the release.",
  frequency: "As scheduled",
};

export function getEventGuide(title: string): EventGuide {
  for (const rule of RULES) {
    if (rule.match.test(title)) return rule.guide;
  }
  return FALLBACK;
}
