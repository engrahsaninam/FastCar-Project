import { Box } from '@chakra-ui/react'
import React from 'react'
import PriceSummaryContent from './PriceSummaryContent'

const PriceSumMain = () => {
  return (
      <Box display={{ base: 'block', lg: 'none' }} w="100%">
          <PriceSummaryContent />
      </Box>
  )
}

export default PriceSumMain
