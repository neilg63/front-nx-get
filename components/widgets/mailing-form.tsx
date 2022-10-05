import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { SiteInfo } from "../../lib/entity-data";
import { artlogicMailing, basePath } from "../../lib/settings";
import { fromReverseBase64, notEmptyString, validEmail } from "../../lib/utils";

/* const getMCRequestParams = (email: string, name: string) => {
  const { apiKey, listId } = mailchimp;

  const dataCentre = typeof apiKey === 'string' && apiKey.includes("-") ? apiKey.split("-")[1] : '';
  const url = `https://${dataCentre}.api.mailchimp.com/3.0/lists/${listId}/members`;

  const data = {
    email_address: email,
    full_name: name,
    status: "subscribed",
  };

  const base64ApiKey = Buffer.from(`anystring:${apiKey}`).toString("base64");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${base64ApiKey}`,
  };

  return { url, data, headers };
}  */

const getMailingRequestParams = (email: string, firstname: string, lastname: string) => {
  const { uri, apiKey } = artlogicMailing;

  const data = {
    email,
    firstname,
    lastname,
  };
  const headers = {
    Origin: basePath,
    'Accept': 'application/json',
  }
  const decodedKey = notEmptyString(apiKey)? fromReverseBase64(apiKey) : '';
  return { uri, data, apiKey: decodedKey, headers };
} 

const MailingForm = ({ site }: { site: SiteInfo }) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [showThanks, setShowThanks] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState<string[]>([]);
  const nameLabel = site.label('firstname', 'First name');
  const lastNameLabel = site.label('lastname', 'Last name');
  const emailLabel = site.label('email', 'Email');
  const submitName = site.label('submit', 'Submit');

  const validate = () => {
    let errorMsgs: string[] = [];
    if (!validEmail(email)) {
      errorMsgs.push('Please enter an email address');
    }
    if (!notEmptyString(firstname)) {
      errorMsgs.push('Please enter your first name');
    }
    const valid = errorMsgs.length < 1;
    setErrorMsgs(errorMsgs);
    setError(!valid);
    return valid;
  }

  const update = (e: any) => {
    if (e instanceof Object) {
      const { target } = e;
      if (target instanceof HTMLInputElement) {
        switch (target.name) {
          case 'firstname':
            setFirstname(target.value);
            break;
          case 'lastname':
            setLastname(target.value);
            break;
          case 'email':
            setEmail(target.value);
            break;
        }
      }
      if (notEmptyString(target.value)) {
        validate();
      }
    }
  }

  const submit = async () => {
    setErrorMsgs([]);
    setError(false);
    const valid = validate();
    if (valid) {
      const { uri, data, headers, apiKey } = getMailingRequestParams(email, firstname, lastname);
      const formData = new FormData();
      if (notEmptyString(apiKey)) {
        formData.append('api_key', apiKey);
      }
      Object.entries(data).forEach(([name, val]) => {
        formData.append(name, val);
      })
      try {
        const response = await fetch(
          uri,
          {
            body: formData,
            mode: 'cors',
            headers,
            method: 'POST',
          }
        );
        if (response.status >= 200 && response.status < 300) {
          const result = await response.json();
          if (result instanceof Object) {
            if (result.success) {
              setShowThanks(true);
              setFirstname('');
              setLastname('');
              setEmail('');
            }
          }
        }
      } catch (e: any) {
        if (e instanceof Object) {
          setError(true);
          setErrorMsgs(['Something went wrong']);
        }
      }
    }
  }

  const thanksMessage = site.label('subscribe_thankyou', 'Thanks for your subscription');
  return (
    <div className="mailing-container">
        <form className="overlay-form mailing-form inner column">
        <h3>{site.label('subscribe_title', 'Subscribe to mailing list')}</h3>
        {showThanks ? <div className="body inner">{thanksMessage}</div> : <>
          <Input name='firstname' type='text' placeholder={nameLabel} size='lg' id='mailing-form-name' rounded={false} value={firstname} onChange={e => update(e)} aria-labelledby={nameLabel} />
          <Input name='lastname' type='text' placeholder={lastNameLabel} size='lg' id='mailing-form-name' rounded={false} value={lastname} onChange={e => update(e)} aria-labelledby={lastNameLabel} />
          <Input name='email' type='email' placeholder={emailLabel} size='lg' id='mailing-form-email' rounded={false} value={email} aria-labelledby={emailLabel} onChange={e => update(e)} />
          {error && <ul className='error error-list'>{
            errorMsgs.map((msg: string, mi: number) => <li key={['mailing-error', mi].join('-')}>{msg}</li>)
          }</ul>}
          <Button id='mailing-form-submit' rounded={false} onPress={e => submit()}>{submitName}</Button>
        </>}
      </form>
    </div>
  );
};

export default MailingForm;