import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

import { fetchCalendarEvents } from "@/lib/calendar";

function response(body: unknown, ok = true): Response {
  return {
    ok,
    json: async () => body,
  } as Response;
}

describe("calendar provider", () => {
  const fetchMock = jest.fn<typeof fetch>();

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-09-12T10:00:00.000Z"));
    global.fetch = fetchMock;
  });

  afterEach(() => {
    jest.useRealTimers();
    fetchMock.mockReset();
  });

  it("maps Xoomar's data envelope including low-impact events", async () => {
    fetchMock.mockResolvedValue(
      response({
        data: [
          {
            eventName: "CPI",
            importance: "high",
            scheduledAt: new Date(Date.now() + 60 * 60_000).toISOString(),
            forecast: "2.1%",
          },
          {
            eventName: "Consumer Sentiment",
            importance: "low",
            scheduledAt: new Date(Date.now() + 2 * 60 * 60_000).toISOString(),
          },
        ],
        updatedAt: new Date().toISOString(),
        source: "xoomar.com",
      }),
    );

    const result = await fetchCalendarEvents();

    expect(result.source).toBe("xoomar");
    expect(result.error).toBeUndefined();
    expect(result.events).toHaveLength(2);
    expect(result.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "CPI",
          impact: "high",
          source: "xoomar",
        }),
        expect.objectContaining({
          title: "Consumer Sentiment",
          impact: "low",
          source: "xoomar",
        }),
      ]),
    );
  });

  it("preserves a successful empty Xoomar calendar without using mock events", async () => {
    fetchMock.mockResolvedValue(response({ data: [] }));

    const result = await fetchCalendarEvents();

    expect(result.source).toBe("xoomar");
    expect(result.events).toEqual([]);
    expect(result.error).toBeUndefined();
  });

  it("keeps compatibility with a bare Xoomar array response", async () => {
    fetchMock.mockResolvedValue(
      response([
        {
          eventName: "FOMC",
          importance: "medium",
          scheduledAt: new Date(Date.now() + 2 * 60 * 60_000).toISOString(),
        },
      ]),
    );

    const result = await fetchCalendarEvents();

    expect(result.source).toBe("xoomar");
    expect(result.events[0]?.title).toBe("FOMC");
  });

  it("uses mock events when Xoomar is unavailable", async () => {
    fetchMock.mockResolvedValue(response({ error: "unavailable" }, false));

    const result = await fetchCalendarEvents();

    expect(result.source).toBe("mock");
    expect(result.error).toBe("Live calendar unavailable — showing demo events");
  });
});
