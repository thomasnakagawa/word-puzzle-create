import { Link, useParams } from "react-router-dom";
import CopyButtion from "../uiElements/CopyButton";

export default function SharePage(): JSX.Element {
  const { id } = useParams();
  
  const url: string = `${window.location.origin}${window.location.pathname}#/puzzle/${id}`;
  return (
    <>
      <p>Use this link to share your word puzzle:</p>
      <p>{url}</p>
      <CopyButtion text='Copy link' content={url}/>
      <br/>
      <br/>
      <Link to={`/puzzle/${id}`}>Click here to go to your puzzle</Link>
    </>
  );
}
