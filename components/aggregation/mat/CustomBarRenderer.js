export const CustomBarRenderer = (
  ctx, props
) => {
  const {
    bar: { color, height, width, x, y, data }, 

    borderColor,
    borderRadius,
    borderWidth,
    label,
    labelColor,
    shouldRenderLabel,
  } = props

  ctx.fillStyle = color
 
  if (ctx.highlight === `${data.indexValue}_${data.data.rowLabel}`) {
    ctx.strokeStyle = borderColor
    ctx.lineWidth = 2
  }

  // This doesn't seem to hit after setting the value in tooltip.onClose
  if (ctx.highlight === '') {
    ctx.lineWidth = 1
  }

  if (borderWidth > 0) {
      ctx.strokeStyle = borderColor
      ctx.lineWidth = borderWidth
  }

  ctx.beginPath()

  if (borderRadius > 0) {
      const radius = Math.min(borderRadius, height)

      ctx.moveTo(x + radius, y)
      ctx.lineTo(x + width - radius, y)
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
      ctx.lineTo(x + width, y + height - radius)
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
      ctx.lineTo(x + radius, y + height)
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
      ctx.lineTo(x, y + radius)
      ctx.quadraticCurveTo(x, y, x + radius, y)
      ctx.closePath()
  } else {
      ctx.rect(x, y, width, height)
  }

  ctx.fill()

  if (borderWidth > 0 || ctx.highlight === `${data.indexValue}_${data.data.rowLabel}`) {
      ctx.stroke()
  }

  if (shouldRenderLabel) {
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'
      ctx.fillStyle = labelColor
      ctx.fillText(label, x + width / 2, y + height / 2)
  }
}