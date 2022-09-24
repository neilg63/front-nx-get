import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { SiteInfo } from "../../lib/entity-data";
import { mailchimp } from "../../lib/settings";
import { notEmptyString, validEmail } from "../../lib/utils";

const getMCRequestParams = (email: string, name: string) => {
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
} 

const MailchimpForm = ({ site }: { site: SiteInfo }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showThanks, setShowThanks] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState<string[]>([]);
  const nameLabel = site.label('name', 'Name');
  const emailLabel = site.label('email', 'Email');
  const submitName = site.label('submit', 'Submit');

  const update = (e: any) => {
    if (e instanceof Object) {
      const { target } = e;
      if (target instanceof HTMLInputElement) {
        switch (target.name) {
          case 'name':
            setName(target.value);
            break;
          case 'email':
            setEmail(target.value);
            break;
        }
      }
    }
  }

  const submit = async () => {

    let errorMsgs: string[] = [];
    setErrorMsgs([]);
    setError(false);
    if (!validEmail(email)) {
      errorMsgs.push('Please enter an email address');
    }
    if (!notEmptyString(name)) {
      errorMsgs.push('Please enter your name');
    }
    if (errorMsgs.length < 1) {
      const { url, data, headers } = getMCRequestParams(email, name);
      try {
        const response = await fetch(
          url,
          {
            body: JSON.stringify(data),
            headers,
            method: 'POST'
          }
        );
        if (response.status >= 200 && response.status < 300) {
          const result = await response.json();
          if (result instanceof Object) {
            setShowThanks(true);
            setName('');
            setEmail('');
          }
        }
      } catch (e: any) {
        if (e instanceof Object) {
          setError(true);
          setErrorMsgs(['Something went wrong']);
        }
      }
    } else {
      setErrorMsgs(errorMsgs);
    }
  }

  const thanksMessage = site.label('subscribe_thankyou', 'Thanks for your subscription');
  return (
    <div className="mailchimp-container">
      {showThanks ? <div className="body">{ thanksMessage }</div> : 
      <form className="overlay-form mailchimp-form inner column">
        <Input name='name' type='text' placeholder={ nameLabel }  size='lg' id='mailchimp-form-name' rounded={false} value={name }  onChange={e => update(e)} aria-labelledby={nameLabel}  />
          <Input name='email' type='email' placeholder={emailLabel} size='lg' id='mailchimp-form-email' rounded={false} value={email} aria-labelledby={emailLabel} onChange={e => update(e)} />
          {error && <ul>{
            errorMsgs.map((msg: string, mi: number) => <li key={ ['mailchim-error', mi].join('-') }>{ msg}</li>)
          }</ul>}
        <Button id='mailchimp-form-submit' rounded={false} onPress={e => submit()}>{submitName}</Button>
      </form>}
    </div>
  );
};

export default MailchimpForm;