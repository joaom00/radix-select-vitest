import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as HoverCard from "@radix-ui/react-hover-card";

global.ResizeObserver = class ResizeObserver {
  cb: any;
  constructor(cb: any) {
    this.cb = cb;
  }
  observe() {
    this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }]);
  }
  unobserve() {}
  disconnect() {}
} as any;

const DEFAULT_OPEN_DELAY_HOVER_CARD = 700;

it("should pass", async () => {
  const user = userEvent.setup();
  render(
    <HoverCard.Root>
      <HoverCard.Trigger href="#">Link</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content>
          Awesome link content
          <HoverCard.Arrow />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );

  expect(screen.getByRole("link")).toBeInTheDocument();

  await user.hover(screen.getByRole("link"));
  await waitFor(
    () => 
      expect(screen.getByText("Awesome link content")).toBeInTheDocument()
    ,
    { timeout: DEFAULT_OPEN_DELAY_HOVER_CARD }
  );
});
