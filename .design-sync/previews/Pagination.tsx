import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from 'web-2025'

export const BlogPagination = () => (
  <Pagination>
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious href='/blog/page/1' />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href='/blog/page/1'>1</PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href='/blog/page/2' isActive>
          2
        </PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href='/blog/page/3'>3</PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationEllipsis />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href='/blog/page/8'>8</PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationNext href='/blog/page/3' />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
)

export const FirstPageActive = () => (
  <Pagination>
    <PaginationContent>
      <PaginationItem>
        <PaginationLink href='/blog/page/1' isActive>
          1
        </PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href='/blog/page/2'>2</PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href='/blog/page/3'>3</PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationNext href='/blog/page/2' />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
)
