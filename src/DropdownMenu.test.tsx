import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

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

it('should pass', async () => {
  const user = userEvent.setup();
  render(
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="IconButton" aria-label="Customise options">
          Customise options
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
          <DropdownMenu.Item className="DropdownMenuItem">
            New Tab <div className="RightSlot">⌘+T</div>
          </DropdownMenu.Item>
          <DropdownMenu.Item className="DropdownMenuItem">
            New Window <div className="RightSlot">⌘+N</div>
          </DropdownMenu.Item>
          <DropdownMenu.Item className="DropdownMenuItem" disabled>
            New Private Window <div className="RightSlot">⇧+⌘+N</div>
          </DropdownMenu.Item>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className="DropdownMenuSubTrigger">
              More Tools
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent
                className="DropdownMenuSubContent"
                sideOffset={2}
                alignOffset={-5}
              >
                <DropdownMenu.Item className="DropdownMenuItem">
                  Save Page As… <div className="RightSlot">⌘+S</div>
                </DropdownMenu.Item>
                <DropdownMenu.Item className="DropdownMenuItem">Create Shortcut…</DropdownMenu.Item>
                <DropdownMenu.Item className="DropdownMenuItem">Name Window…</DropdownMenu.Item>
                <DropdownMenu.Separator className="DropdownMenu.Separator" />
                <DropdownMenu.Item className="DropdownMenuItem">Developer Tools</DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          <DropdownMenu.Separator className="DropdownMenuSeparator" />

          <DropdownMenu.Arrow className="DropdownMenuArrow" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );

  const trigger = screen.getByRole('button', {
    name: 'Customise options',
  });
  expect(trigger).toBeInTheDocument();

  await user.click(trigger);

  expect(trigger).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('menuitem', { name: /New Tab/ })).toBeInTheDocument();
  expect(screen.getByRole('menuitem', { name: /New Window/ })).toBeInTheDocument();
  expect(screen.getByRole('menuitem', { name: /New Private Window/ })).toHaveAttribute(
    'aria-disabled',
    'true'
  );
  expect(screen.getByRole('menuitem', { name: /More Tools/ })).toBeInTheDocument();

  // SubMenu
  const subMenuTrigger = screen.getByRole('menuitem', { name: /More Tools/ });
  expect(subMenuTrigger).toHaveAttribute('aria-expanded', 'false');

  await user.click(subMenuTrigger);

  expect(screen.getByRole('menuitem', { name: /Save Page As/ })).toBeInTheDocument();
  expect(screen.getByRole('menuitem', { name: /Create Shortcut/ })).toBeInTheDocument();
  expect(screen.getByRole('menuitem', { name: /Name Window/ })).toBeInTheDocument();
  expect(screen.getByRole('menuitem', { name: /Developer Tools/ })).toBeInTheDocument();

  await user.click(screen.getByRole('menuitem', { name: /New Tab/ }));

  expect(trigger).toHaveAttribute('aria-expanded', 'false');
});
