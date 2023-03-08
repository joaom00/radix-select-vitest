import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as Select from '@radix-ui/react-select';

class MockPointerEvent extends Event {
  button: number;
  ctrlKey: boolean;
  pointerType: string;

  constructor(type: string, props: PointerEventInit) {
    super(type, props);
    this.button = props.button || 0;
    this.ctrlKey = props.ctrlKey || false;
    this.pointerType = props.pointerType || 'mouse';
  }
}
window.PointerEvent = MockPointerEvent as any;
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();

it('should pass', async () => {
  const user = userEvent.setup();
  render(
    <Select.Root>
      <Select.Trigger aria-label="Food">
        <Select.Value placeholder="Select a fruit..." />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content>
          <Select.Viewport>
            <Select.Item value="apple">
              <Select.ItemText>Apple</Select.ItemText>
            </Select.Item>
            <Select.Item value="banana">
              <Select.ItemText>Banana</Select.ItemText>
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );

  const trigger = screen.getByRole('combobox', {
    name: 'Food',
  });
  expect(trigger).toBeInTheDocument();
  expect(within(trigger).getByText('Select a fruit...')).toBeInTheDocument();

  await user.click(trigger);

  expect(trigger).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'Banana' })).toBeInTheDocument();

  await user.click(screen.getByRole('option', { name: 'Apple' }));

  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(within(trigger).getByText('Apple')).toBeInTheDocument();
});
