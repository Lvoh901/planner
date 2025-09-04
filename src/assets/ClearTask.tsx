
const ClearTask = ({ onClearTasks, isLoading }) => {
  return (
    <div className="pt-5">
        <button className="py-3 px-4 bg-red-600 text-white font-bold uppercase text-xs rounded-md hover:shadow-md cursor-pointer hover:scale-105" onClick={onClearTasks} disabled={isLoading}>Clear Tasks</button>
    </div>
  )
}

export default ClearTask;