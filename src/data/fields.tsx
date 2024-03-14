import { string, type Schema, array } from "yup";
import { industries } from "./industries";
import { roleOptions } from "./roles";
import { goalOptions } from "./goals";

type Field = {
  id: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content?: any;
  inputType?: string;
  inputSchema?: Schema;
  comboboxOptions?: {
    label: string;
    value: string;
  }[];
  choices?: {
    label: string;
    value: string;
    editable?: boolean;
    showIfRole?: string;
  }[];
  maxChoices?: number;
  cta?: string;
};

export const fields = [
  {
    id: "info",
    label: "Up-skilling requires time commitment",
    content: (
      <p>
        The GrowthX experience is designed by keeping in mind the working hours
        founders & full time operators typically work in.
        <br />
        <br />
        You will spend
        <br />
        - 6 hours/week for the first 5 weeks
        <br />- 15 hours/week for the last 3 weeks
      </p>
    ),
    cta: "I agree",
  },
  {
    id: "fname",
    label: "What's your first name?",
    inputType: "text",
    inputSchema: string().required(),
  },
  {
    id: "lname",
    label: "What's your last name, {fname}?",
    inputType: "text",
    inputSchema: string().required(),
  },
  {
    id: "industries",
    label: "What industry is your company in?",
    content: "We will personalize your learning experience accordingly",
    comboboxOptions: industries,
    inputSchema: string().required(),
  },
  {
    id: "role",
    label: "Your role in your company?",
    content: "We want to understand how you spend your time right now.",
    choices: roleOptions,
    inputType: "radio",
    inputSchema: string().required(),
  },
  {
    id: "goals",
    label: "{fname}, what's your professional goal for the next 12 months?",
    content: "Any 2",
    choices: goalOptions,
    maxChoices: 2,
    inputType: "checkbox",
    inputSchema: array(string())
      .length(2)
      .required()
      .typeError("choose exactly 2"),
  },
  {
    id: "email",
    label: "Email you'd like to register with?",
    content: (
      <p>
        We will keep all our communications with you through this email. Do
        check your spam inbox if you can't find our application received email.
      </p>
    ),
    inputType: "email",
    inputSchema: string().email().required(),
  },
  {
    id: "phone",
    label: "Your phone number",
    content: (
      <p>
        We won't call you unless it is absolutely required to process your
        application.
      </p>
    ),
    inputType: "tel",
    inputSchema: string()
      .matches(
        new RegExp(
          /^(\+\d{1,2}\s?)?1?-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
        ),
        "Invalid phone number",
      )
      .required(),
  },
] satisfies Field[];
