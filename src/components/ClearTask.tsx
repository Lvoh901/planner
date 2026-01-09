type ClearTaskProps = {
  onClearTasks: () => void;
  isLoading: boolean;
};

const ClearTask: React.FC<ClearTaskProps> = ({ onClearTasks, isLoading }) => {
  return (
    <div>
      <button
        className="group relative px-5 py-2.5 font-bold text-red-500 transition-all duration-300 bg-red-50 rounded-xl hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onClearTasks}
        disabled={isLoading}
      >
        <span className="relative z-10 flex items-center gap-2">
          Clear All Tasks
        </span>
      </button>
    </div>
  );
};

export default ClearTask;
