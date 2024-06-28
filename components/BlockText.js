const BlockText = ({ className, ...props }) => (
  <div
    className={`bg-gray-100 border-l border-blue-600 p-3 font-base ${className}`}
    {...props}
  />
)

export default BlockText
