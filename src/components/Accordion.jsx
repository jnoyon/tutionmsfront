
export default function Accordion({heading, content}) {
  return (
    <div>
      <div className="collapse collapse-plus bg-base-100 border border-base-300">
        <input type="radio" name="my-accordion-3" defaultChecked />
        <div className="collapse-title text-sm p-2">  {heading} </div>
        <div className="collapse-content text-xs px-2"> {content} </div>
      </div>


    </div>
  );
}
