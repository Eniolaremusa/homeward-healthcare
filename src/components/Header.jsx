/**
 * @param {object} props
 * @param {string[]} props.breadcrumbs — segments joined with " / "
 * @param {string} props.title — page title (h1)
 */
function Header({ breadcrumbs = ['Home', 'New Patient'], title = 'Create a New Care Case' }) {
  return (
    <header className="flex h-[93px] items-center border-b border-ds-border-base bg-ds-canvas-base px-8">
      <div className="space-y-[6px]">
        <p className="text-[15px] font-medium leading-[23px] tracking-[-0.3px] text-ds-text-base">
          {breadcrumbs.join(' / ')}
        </p>
        <h1 className="text-[18px] font-medium leading-6 tracking-[-0.54px] text-ds-text-dark">{title}</h1>
      </div>
    </header>
  )
}

export default Header
