export interface LinkedAction {
  /** URL endpoint for an action */
  href: string;
  /** button text rendered to the user */
  label: string;
  /** Parameter to accept user input within an action */
  parameters?: [ActionParameter];
}

/** Parameter to accept user input within an action */
export interface ActionParameter {
  /** parameter name in url */
  name: string;
  /** placeholder text for the user input field */
  label?: string;
  /** declare if this field is required (defaults to `false`) */
  required?: boolean;
}

export interface ActionError {
  /** non-fatal error message to be displayed to the user */
  message: string;
}

export interface ActionGetResponse {
  /** image url that represents the source of the action request */
  icon: string;
  /** describes the source of the action request */
  title: string;
  /** brief summary of the action to be performed */
  description: string;
  /** button text rendered to the user */
  label: string;
  /** UI state for the button being rendered to the user */
  disabled?: boolean;
  links?: {
    /** list of related Actions a user could perform */
    actions: LinkedAction[];
  };
  /** non-fatal error message to be displayed to the user */
  error?: ActionError;
}

export interface ActionPostRequest {
  /**
   * The value must be the base58-encoded public key of an account that may sign the transaction.
   */
  account: string;
}

export interface ActionPostResponse {
  /** base64 encoded serialized transaction */
  transaction: string;
  /** describes the nature of the transaction */
  message?: string;
}

export interface RegisteredAction {
  host: string;
  state: "trusted" | "node" | "blocked";
}

export interface ActionRegistryGetResponse {
  websites: RegisteredAction[];
}
