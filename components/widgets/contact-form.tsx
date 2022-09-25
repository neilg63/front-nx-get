import { Button, Input, Textarea } from "@nextui-org/react";
import { useState } from "react";
import { SiteInfo } from "../../lib/entity-data";
import { SimpleLink } from "../../lib/interfaces";
import { clearLocal, fromLocal, toLocal } from "../../lib/localstore";
import { notEmptyString, validEmail } from "../../lib/utils";

const toFormValue = (value: string, format = '') => {
  const row = notEmptyString(format) ? { value, format } : { value };
  return [row];
}

const ContactForm = ({ site }: { site: SiteInfo }) => {
  const stored = fromLocal('contact_form');
  let defName = '';
  let defEmail = '';
  let defMessage = '';
  if (stored.valid) {
    if (stored.data.name) {
      defName = stored.data.name;
    }
    if (stored.data.email) {
      defEmail = stored.data.email;
    }
    if (stored.data.message) {
      defMessage = stored.data.message;
    }
  }
  const [name, setName] = useState(defName);
  const [email, setEmail] = useState(defEmail);
  const [message, setMessage] = useState(defMessage);
  const [error, setError] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState<string[]>([]);
  const [showThanks, setShowThanks] = useState(false);

  const nameLabel = site.label('name', 'Name');
  const emailLabel = site.label('email', 'Email');
  const messageLabel = site.label('message', 'Message');
  const submitName = site.label('submit', 'Submit');


  const validate = () => {
    const errorMsgs : string[] = [];
    if (!notEmptyString(name)) {
      errorMsgs.push('Please add your name')
    }
    if (!validEmail(email)) {
      errorMsgs.push('Please add a valid email address')
    }
    if (!notEmptyString(message)) {
      errorMsgs.push('Please add a message');
    }
    setErrorMsgs(errorMsgs);
    setError(errorMsgs.length > 0);
    return !error;
  }

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
      } else if (target instanceof HTMLTextAreaElement && target.name === 'message') {
        setMessage(target.value);
      }
      if (notEmptyString(target.value)) {
        validate();
      }
      saveState();
    }
  }

  const submit = async () => {
    const payload: Map<string, any> = new Map();
    payload.set('contact_form', 'contact');
    setError(false);
    setErrorMsgs([]);
    const valid = validate();
    if (valid) {
      payload.set('name', toFormValue(name));
      payload.set('subject', toFormValue(`Web site contact form Message from ${name}`));
      payload.set('mail', toFormValue(email));
      payload.set('message', toFormValue(message, 'plain'));
      const uri = [process.env.NEXT_PUBLIC_DRUPAL_BASE_URL, 'entity/contact_message'].join('/');
      const data = Object.fromEntries(payload);
      try {
        const response = await fetch(
          uri,
          {
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST'
          }

        );

        if (response.status >= 200 && response.status < 300) {
          const result = await response.json();
          if (result instanceof Object) {
            setShowThanks(true);
            setName('');
            setEmail('');
            setMessage('');
            clearLocal('contact_form');
          }
        }
      } catch (e: any) {
        if (e instanceof Object) {
          setError(true);
          setErrorMsgs(['Something went wrong']);
        }
      }
    } else {
      setError(true);
      setErrorMsgs(errorMsgs);
    }
  }

  const saveState = () => {
    const data = { name, email, message };
    toLocal('contact_form', data);
  }

  const thanksMessage = site.contactMessage;
  return (
    <div className="contact-container">
      <form className="overlay-form contact-form column">
        <h3>{site.label('contact_title', 'Contact')}</h3>
        {showThanks ? <div className="body inner">{thanksMessage}</div> : <>
          <Input name='name' type='text' placeholder={nameLabel} size='lg' id='contact-form-name' rounded={false} value={name} onChange={e => update(e)} aria-labelledby={nameLabel} />
          <Input name='email' type='email' placeholder={emailLabel} size='lg' id='contact-form-email' rounded={false} value={email} aria-labelledby={emailLabel} onChange={e => update(e)} />
          <Textarea name='message' size='lg' placeholder={messageLabel} id='contact-form-message' value={message} aria-labelledby={messageLabel} onChange={e => update(e)} />
          {error && <ul className='error error-list'>{
            errorMsgs.map((msg: string, mi: number) => <li key={['mailchim-error', mi].join('-')}>{msg}</li>)
          }</ul>}
          <Button id='contact-form-submit' rounded={false} onPress={e => submit()}>{submitName}</Button>
        </>}
      </form>
      {site.hasGalleries && <ul className='galleries'>
        {site.galleries.map((gallery: SimpleLink) => <li key={gallery.itemKey}><a href={gallery.path} target='_blank' rel='noreferrer'>{ gallery.title }</a></li>)}
      </ul>}
    </div>
  );
};

export default ContactForm;