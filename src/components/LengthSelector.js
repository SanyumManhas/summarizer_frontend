
export default function LengthSelector(props) {
  const {Level, setLevel} = props
  const labels = ["Short", "Long", "Descriptive"];

  return (
    <div className="flex flex-col items-center space-y-1 mr-4">
        <div className="flex justify-between w-64 text-xs text-gray-300">
          {labels.map((label, id)=><span key={id}>{label}</span>)}
        </div>
        <input
            type="range"
            min="1"
            max="3"
            value={Level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="w-64 accent-red-500 cursor-pointer h-1"
        />
    </div>
  );
}
