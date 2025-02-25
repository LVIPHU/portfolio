type Props = {
  description: string
}

export const Footer = (props: Props) => {
  const { description } = props
  return (
    <footer className={'text-sm'}>
      <p>
        <i>{description}</i>
      </p>
      <br />
      <p>
        <strong>{process.env.owner}</strong>
      </p>
      <p>
        &copy; {new Date().getFullYear()} {process.env.owner}. All rights reserved!
      </p>
    </footer>
  )
}
