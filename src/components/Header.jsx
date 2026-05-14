function Header() {
  return (
    <header className="flex h-[93px] items-center border-b border-ds-border-base bg-ds-canvas-base px-8">
      <div className="space-y-[6px]">
        <div className="flex items-center gap-ds-4 text-[15px] font-medium leading-[23px] tracking-[-0.3px] text-ds-text-base">
          <span>Home</span>
          <span>/</span>
          <span>New Patient</span>
        </div>
        <h1 className="text-[18px] font-medium leading-6 tracking-[-0.54px] text-ds-text-dark">
          Create a New Care Case
        </h1>
      </div>
    </header>
  )
}

export default Header
