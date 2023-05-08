import { Result, err, ok } from "neverthrow";

type Unvalidated = {
  kind: "unvalidated";
  value?: number;
};
type Validated = {
  kind: "validated";
  value: number;
};
type Created = {
  id: number;
  kind: "created";
  value: number;
};

const randomValue = Math.random();

const state: Unvalidated = {
  kind: "unvalidated",
  value: randomValue < 0.5 ? undefined : randomValue,
};

const validate = (args: Unvalidated): Result<Validated, Error> => {
  // Math.randomにより50%の確率でエラーを返す
  if (args.value === undefined) {
    return err(new Error("value should be defined"));
  }
  return ok({
    kind: "validated",
    value: args.value,
  });
};

const createObject = (args: Validated): Result<Created, never> => {
  return ok({
    id: new Date().getTime(),
    kind: "created",
    value: args.value,
  });
};

try {
  const result = ok(state)
    .andThen(validate)
    .andThen(createObject)
    .match(
      (t) => t,
      (e) => {
        throw new Error("Something went wrong", { cause: e });
      }
    );
  console.log(result);
} catch (error) {
  if (error instanceof Error) {
    console.error(`Error: ${error.message}`);
    if (error.cause instanceof Error) {
      console.error(`cause: ${error.cause.message}`);
    }
  }
}
