export function Label({ htmlFor, className, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className={["pointer mb-1 block font-semibold", className ?? ""].join(
        " "
      )}
    >
      {children}
    </label>
  );
}
export function Input({
  type = "text",
  name,
  id = name,
  placeholder,
  className,
  defaultValue,
  defaultChecked,
  ...rest
}) {
  return (
    <input
      type={type}
      name={name}
      id={id}
      placeholder={placeholder}
      defaultValue={defaultValue}
      defaultChecked={defaultChecked}
      {...rest}
      className={[
        "rounded border border-slate-200 py-2 px-3",
        className ?? "",
      ].join(" ")}
    />
  );
}
export function Button({ type = "submit", children }) {
  return (
    <button
      type={type}
      className="rounded bg-blue-600 py-2 px-3 text-white transition-colors hover:bg-blue-700"
    >
      {children}
    </button>
  );
}
export function ErrorMessage({ children }) {
  if (!children) {
    return null;
  }
  return (
    <div className="mb-3 rounded border border-amber-500 bg-amber-50 p-2 text-sm  text-amber-500">
      {children}
    </div>
  );
}
