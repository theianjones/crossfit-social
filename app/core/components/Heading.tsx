import type { HeadingProps as AdobeHeadingProps } from "@react-types/text"
import { Heading as AdobeHeading } from "@adobe/react-spectrum"

interface HeadingProps extends AdobeHeadingProps {
  serif?: boolean
}

const Heading = (props: HeadingProps) => {
  const { level, serif } = props
  let fontSize = "var(--spectrum-global-dimension-size-175)"
  switch (level) {
    case 1:
      fontSize = "var(--spectrum-global-dimension-size-450)"
      break
    case 2:
      fontSize = "var(--spectrum-global-dimension-size-300)"
    case 3:
      fontSize = "var(--spectrum-global-dimension-size-200)"
  }
  const fontFamily = serif
    ? "var(--spectrum-global-font-family-serif)"
    : "var(--spectrum-global-font-family-base)"

  return <AdobeHeading {...props} UNSAFE_style={{ fontSize, fontFamily }} />
}

export default Heading
