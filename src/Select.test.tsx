import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as Select from "@radix-ui/react-select";
import App from "./App";

class MockPointerEvent extends Event {
  button: number;
  ctrlKey: boolean;
  pointerType: string;

  constructor(type: string, props: PointerEventInit) {
    super(type, props);
    this.button = props.button || 0;
    this.ctrlKey = props.ctrlKey || false;
    this.pointerType = props.pointerType || "mouse";
  }
}
window.PointerEvent = MockPointerEvent as any;
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();

it("should pass", async () => {
  const user = userEvent.setup();
  render(<App />);

  const trigger = screen.getByRole("combobox", {
    name: "Food",
    expanded: false,
  });
  expect(trigger).toBeInTheDocument();

  await user.click(trigger);

  expect(
    screen.getByRole("combobox", { name: 'Food', expanded: true, hidden: true })
  ).toBeInTheDocument();
  expect(screen.getByRole("option", { name: "Apple" })).toBeInTheDocument();
  expect(screen.getByRole("option", { name: "Banana" })).toBeInTheDocument();

  await user.click(screen.getByRole("option", { name: "Apple" }));

  expect(screen.getByRole("combobox", { name: "Food", expanded: false }));
});
