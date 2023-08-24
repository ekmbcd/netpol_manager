type NewElementButtonProps = {
  onClick: () => void;
};

function NewElementButton({ onClick }: NewElementButtonProps) {
  return (
    <button
      className="grid place-content-center w-6 h-6 mr-2 text-green-100 
       text-lg transition-colors duration-150 bg-green-500 rounded-full focus:shadow-outline hover:bg-green-600 shrink-0"
      type="button"
      onClick={onClick}
    >
      <p className="pb-0.5">+</p>
    </button>
  );
}

export default NewElementButton;
