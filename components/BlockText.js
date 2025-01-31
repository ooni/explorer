const BlockText = ({ className, ...props }) => (
  <div
    className={`bg-gray-50 border-s-[10px] border-blue-500 p-3 font-base ${className}`}
    {...props}
  />
)

export default BlockText
