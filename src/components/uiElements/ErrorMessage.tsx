import { Link } from 'react-router-dom';

interface IProps {
  message?: string;
}

export default function ErrorMessage(props: IProps): JSX.Element {
  return (
    <>
      <p>{props.message ?? 'Something went wrong'}</p>
      <Link to='/'>Home</Link>
    </>
  );
}
