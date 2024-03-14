/* eslint-disable @typescript-eslint/no-explicit-any */
import { ListBoxItem } from "react-aria-components";
import { Combobox } from "./components/Combobox";
import { useCallback, useEffect, useRef, useState } from "react";
import { fields } from "./data/fields";
import qs from "qs";
import { ValidationError } from "yup";

function Root() {
  const formRef = useRef<HTMLFormElement>(null);

  const [currentField, setCurrentField] = useState<number>(0);

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [completed, setCompleted] = useState<boolean>(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setErrors({});

      const currentFormData = qs.parse(
        new URLSearchParams(new FormData(formRef.current!) as any).toString(),
      );

      setFormData(currentFormData);

      const fieldsToValidate = fields
        .slice(0, currentField + 1)
        .filter((feild) => feild.inputSchema);

      for (const feild of fieldsToValidate) {
        try {
          feild.inputSchema?.validateSync(currentFormData[feild.id]);
        } catch (error) {
          setErrors((prev) => ({
            ...prev,
            [feild.id]: (error as ValidationError).message,
          }));

          setCurrentField(fields.indexOf(feild));

          return;
        }
      }

      if (currentField === fields.length - 1) {
        fetch("https://eo3oi83n1j77wgp.m.pipedream.net", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentFormData),
        })
          .then((res) => {
            if (res.ok) {
              setCompleted(true);
            }
          })
          .catch((error) => {
            console.log(error);
            setErrors((prev) => ({
              ...prev,
              [fields[currentField].id]: error,
            }));
          });
      } else {
        setCurrentField((prev) => prev + 1);
      }
    },
    [currentField],
  );

  useEffect(() => {
    const enterListener = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSubmit(e as any);
      }
    };

    document.addEventListener("keydown", enterListener);

    return () => {
      document.removeEventListener("keydown", enterListener);
    };
  }, [handleSubmit]);

  useEffect(() => {
    const field = fields[currentField];
    const inputRef = document.querySelector(`#${field.id}`);

    if (inputRef) {
      (inputRef as HTMLInputElement).focus?.();
    }
  }, [currentField]);

  console.log(formData);

  return (
    <>
      <div
        className="absolute top-0 h-1 bg-blue-500 transition-[width] ease-in-out duration-300"
        style={{
          width: `${(currentField / (fields.length - 1)) * 100}%`,
        }}
      ></div>
      <div className="container mx-auto max-w-2xl px-6 mt-32 flex flex-col items-stretch justify-start gap-12">
        <img src="growthx_logo.svg" alt="logo" className="h-8 self-start" />
        {completed ? (
          <div className="text-2xl">
            Thanks for completing this typeform <br /> Now{" "}
            <strong> create your own</strong> — it's free, easy, & beautiful
          </div>
        ) : (
          <form method="post" onSubmit={handleSubmit} ref={formRef}>
            {fields.map((feild, i) => {
              return (
                <div
                  key={feild.id}
                  className={`${currentField === i ? "flex flex-col items-stretch justify-start gap-8" : "sr-only"}`}
                >
                  <div>
                    <label htmlFor={feild.id} className="text-xl text-white">
                      {feild.label.replace(
                        /{(\w+)}/g,
                        (match, p1) => formData[p1] || match,
                      )}
                    </label>
                    {feild.content && (
                      <p className="text-lg opacity-70 mt-2">{feild.content}</p>
                    )}
                  </div>
                  {(feild.inputType === "text" ||
                    feild.inputType === "email") && (
                    <input
                      name={feild.id}
                      type={feild.inputType}
                      placeholder={
                        feild.inputType === "text"
                          ? "Type your answer here..."
                          : "name@example.com"
                      }
                      className="w-full bg-transparent border-b-2 border-b-white/30 outline-none focus:outline-none text-3xl py-3 focus:border-b-white duration-300"
                    />
                  )}

                  {feild.comboboxOptions && (
                    <Combobox name={feild.id}>
                      {feild.comboboxOptions?.map((option, i) => (
                        <ListBoxItem
                          key={i}
                          textValue={option.value}
                          className={"cursor-pointer"}
                        >
                          {option.label}
                        </ListBoxItem>
                      ))}
                    </Combobox>
                  )}

                  <div className="flex flex-col gap-2">
                    {feild.choices &&
                      feild.choices.map((choice) => (
                        <label
                          htmlFor={choice.value}
                          key={choice.value}
                          className="text-start bg-blue-500/10 rounded px-6 py-2 flex flex-row items-center text-md border border-white/5 cursor-pointer"
                        >
                          <input
                            type={feild.inputType}
                            value={choice.value}
                            id={choice.value}
                            name={feild.id}
                            className="mr-2"
                          />
                          {choice.label}
                        </label>
                      ))}
                  </div>
                  {feild.inputType === "tel" && (
                    <div className="flex flex-row gap-2 w-full">
                      <input
                        name={feild.id}
                        id={feild.id}
                        type={"tel"}
                        placeholder="+918665866936"
                        className="flex-1 bg-transparent border-b-2 border-b-white/30 outline-none focus:outline-none text-3xl py-3 focus:border-b-white duration-300"
                      />
                    </div>
                  )}

                  {errors[feild.id] ? (
                    <p className="px-3 py-1.5 text-base/none bg-red-500/50 text-red-200 rounded-md w-max">
                      {errors[feild.id]}
                    </p>
                  ) : null}

                  <div className="flex flex-row gap-2 items-center">
                    <button className="bg-blue-500 rounded px-6 py-2 font-medium text-xl">
                      OK
                    </button>
                    <p className="text-xs">
                      press <span className="font-medium">Enter</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </form>
        )}
      </div>
    </>
  );
}

export default Root;
