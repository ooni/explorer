const SectionHeader = ({ children }) => (
  <div className="flex border-b border-gray-300 pb-4 my-8 flex-wrap">
    {children}
  </div>
)

SectionHeader.Title = ({ children, ...props }) => (
  <a className="text-blue-500 text-4xl font-semibold" {...props}>
    {children}
  </a>
)

//   /* To compenstate for the sticky navigation bar
//      :target selector applies only the element with id that matches
//      the current URL fragment (e.g '/#Overview') */
//   :target::before {
//     content: ' ';
//     display: block;
//     width: 0;
//     /* NOTE: This is the combined height of the NavBar and PageNavMenu */
//     height: 140px;
//   }

export default SectionHeader
