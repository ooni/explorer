export const StyledSticky = ({ ...props }) => (
  <div
    className="sticky top-0 bg-white z-[99] border-b border-gray-300"
    {...props}
  />
)

export const StyledStickyNavBar = ({ ...props }) => (
  <div className="sticky top-0 z-[100]" {...props} />
)

export const StyledStickySubMenu = ({ topClass, ...props }) => (
  <div
    className={`${topClass ? topClass : 'top-[62px]'} sticky  bg-white z-[99] border-b border-gray-300 md:mt-8 mb-2 pb-2 md:pb-0`}
    {...props}
  />
)

export const StickySubMenuUpdated = ({ title, menu, topClass, ...props }) => {
  return (
    <div
      className={`${topClass ? topClass : 'top-[62px]'} sticky  bg-white z-[99] border-b border-gray-300 md:mt-8 mb-2 pb-2 md:pb-0`}
      {...props}
    >
      <div className="flex justify-between items-start md:items-center flex-col md:flex-row">
        <h1 className="mt-1">{title}</h1>
        <div className="flex flex-col md:flex-row justify-start md:justify-end items-start md:items-center">
          <div className="flex flex-row flex-wrap gap-4">{menu}</div>
        </div>
      </div>
    </div>
  )
}

export const StickySubMenu = ({ title, children, topClass }) => {
  return (
    <StyledStickySubMenu topClass={topClass}>
      <div className="flex justify-between items-start md:items-center flex-col md:flex-row">
        <h1 className="mt-1">{title}</h1>
        {children}
      </div>
    </StyledStickySubMenu>
  )
}
