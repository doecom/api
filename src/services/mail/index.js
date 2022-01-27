const fs = require('fs');
const mustache = require('mustache');
const sendGridMail = require('@sendgrid/mail');

const { SENDGRID_API_KEY } = process.env;

sendGridMail.setApiKey(SENDGRID_API_KEY);

const fillTemplate = (templateName, contentTemplateName, language, vars) => {
  const template = fs.readFileSync(
    `${__dirname}/templates/${templateName}.html`, 'utf-8'
  );
  const contentTemplate = fs.readFileSync(
    `${__dirname}/texts/${contentTemplateName}.json`, 'utf-8'
  );

  let content = contentTemplate;
  Object.entries(vars).forEach(([key, value]) => {
    const regex = new RegExp(`{\{${key}\}}`,'ig');
    content = content.replace(regex, value);
  });
  content = JSON.parse(content);

  return mustache.render(template, content[language]);
};

const send = (
  contentTemplateName,
  {
    from,
    to,
    subject
  }={},
  vars={},
  {
    language='default',
    templateName='default',
  }={}
  ) => {
  const html = fillTemplate(
    templateName,
    contentTemplateName,
    language,
    vars
  );
  return sendGridMail.send({
    from,
    to,
    subject,
    html
  });
};

module.exports = {
  send
};
