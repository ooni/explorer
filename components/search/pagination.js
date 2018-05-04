import React from 'react'

import styled from 'styled-components'

import {
  Flex, Box
} from 'ooni-components'

const PreviousPage = styled.div`
  cursor: pointer;
`

const NextPage = styled.div`
  cursor: pointer;
`

const Pagination = ({currentPage, totalPages, goToPage, showCount, onShowCount}) => (
  <Flex align='baseline' justify='space-around' pb={3}>
    <Box>
      <Flex>
        <Box styled={{width: '100px'}} pr={2}>
          {currentPage > 1
    && <PreviousPage onClick={goToPage(currentPage - 1)}>
        &lsaquo; Previous Page
    </PreviousPage>
          }
        </Box>
        <Box>
          {currentPage}/{totalPages === -1 ? '?' : totalPages }
        </Box>
        <Box styled={{width: '100px'}} pl={2}>
          {(totalPages == -1 || totalPages > currentPage)
    && <NextPage onClick={goToPage(currentPage + 1)}>
    Next Page &rsaquo;
    </NextPage>
          }
        </Box>
      </Flex>
    </Box>
  </Flex>
)

export default Pagination
