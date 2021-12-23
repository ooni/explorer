import React, { useEffect, useCallback, useState } from 'react'
import { Box } from 'ooni-components'
import styled from 'styled-components'
import { useResizeDetector } from 'react-resize-detector'

export const ResizableYBox = styled(Box)`
  position: relative;
  border: 5px dotted ${props => props.theme.colors.gray1};
  overflow: hidden;
  resize: vertical;
  min-height: ${props => props.minHeight ?? 250}px;
  max-height: 100vh;
`

export const ResizableBox = ({ children, onResize, ...props}) => {
  const { width, height, ref } = useResizeDetector({
    onResize,
    handleWidth: false,
    skipOnMount: true,
    refreshMode: 'debounce',
    refreshRate: 500,
  })
  return (
    <ResizableYBox ref={ref}>
      {children}
    </ResizableYBox>
  )
}

// const StyledRelativeBox = styled(Box)`
//   position: relative;
//   border: 5px dotted ${props => props.theme.colors.gray1};
//   overflow: auto;
// `


// const DraggableHandle = styled.div`
//   position: absolute;
//   bottom: 0;
//   right: 0;
//   background-color: ${props => props.theme.colors.black};
//   width: 10px;
//   height: 10px;
//   &:hover {
//     cursor: row-resize;
//   }
// `

// export const ResizableBox = ({ children, ...rest }) => {
//   const [isResizable, setIsResizable] = useState(false)
//   const [newHeight, setIsNewHeight] = useState(500)

//   function handleResize() {
//     setIsResizable(true)
//   }

//   const handleMouseMove = React.useCallback((event) => {
//     if (isResizable) {
//       console.log(event.clientY)
//       let offsetBottom = event.clientY
//         // document.body.offsetHeight - (event.clientX - document.body.offsetTop)
//       let minHeight = 50
//       let maxHeight = 700
//       if (offsetBottom > minHeight && offsetBottom < maxHeight) {
//         setIsNewHeight(offsetBottom)
//       }
//     }
//   }, [isResizable])

//   function handleMouseUp() {
//     setIsResizable(false)
//   }

//   useEffect(() => {
//     document.addEventListener('mousemove', handleMouseMove)
//     document.addEventListener('mouseup', handleMouseUp)

//     return () => {
//       document.removeEventListener('mousemove', handleMouseMove)
//       document.removeEventListener('mouseup', handleMouseUp)
//     }
//   }, [handleMouseMove])

//   return (
//     <StyledRelativeBox
//       sx={{
//         width: '100%',
//         height: newHeight,
//         minHeight: 50
//       }}
//       {...rest}
//     >
//       {children}
//       {/* <DraggableHandle onMouseDown={() => handleResize()} /> */}
//     </StyledRelativeBox>
//   )
// }
