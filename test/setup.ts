import { rest } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

Object.defineProperty(window, "localStorage", {
  value: {
    getItem: vi.fn(() => null),
    removeItem: vi.fn(() => null),
    setItem: vi.fn(() => null),
  },
  writable: true,
});

export const restHandlers = [
  rest.get("https://api.moonchute.xyz/account", (req, res, ctx) => {
    return res(
      ctx.json({
        smartAccount: [
          {
            address: "0x1234",
            factoryAddress: "0x5678",
            validator: null,
            provider: "ZeroDev v2",
          },
        ],
      })
    );
  }),
];

const server = setupServer(...restHandlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());

vi.mock("wagmi", async () => {
  const actual: any = await vi.importActual("wagmi");
  return {
    ...actual,
    useAccount: vi.fn().mockReturnValue({
      address: "0x1234",
    }),
    useNetwork: vi.fn().mockReturnValue({
      chain: {
        id: 1,
      },
    }),
  };
});
