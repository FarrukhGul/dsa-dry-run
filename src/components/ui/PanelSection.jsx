/**
 * PanelSection — one titled block inside the dry run panel.
 *
 * Variables, call stack and console all use it, so they line up with each
 * other and only have to describe their own contents.
 */

export function PanelSection({ title, action, children }) {
  return (
    <section className="p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-semibold tracking-wide text-muted uppercase">
          {title}
        </h3>
        {action}
      </div>

      {children}
    </section>
  );
}
