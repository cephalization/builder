import { createElements, setRoot, registerData, deleteData } from "./builder";
import "./styles.css";

const BUILDER_PROPS_EXAMPLE = [
  {
    property: "tag {string}",
    description: "The desired html element to build"
  },
  {
    property: "text {string}",
    description: "Content to fill the html element with"
  },
  {
    property: "classes {string}",
    description: "CSS class string to attach to the element"
  },
  {
    property: "attrs {array}",
    description: "HTML attributes to attach to the element"
  },
  {
    property: "children {array}",
    description:
      "Descriptions of further bricks to build as children to this element"
  }
];
const createListItem = brick => ({
  tag: "li",
  children: [
    {
      tag: "pre",
      text: brick.property
    },
    { tag: "p", text: brick.description }
  ]
});
const createPropertyList = props => props.map(createListItem);

const DOM = [
  { tag: "hr" },
  { tag: "h2", text: "What does it do?" },
  {
    tag: "div",
    classes: "copy",
    text: "Generate dynamic html content with bricks (objects) or templating."
  },
  { tag: "hr" },
  { tag: "h2", text: "Templating" },
  {
    tag: "div",
    classes: "copy",
    text:
      "Data surrounded in double curly braces will be replaced with registered data."
  },
  {
    tag: "div",
    classes: "copy",
    text:
      "This data is bound, meaning that the template will update when its data does."
  },
  {
    tag: "h3",
    text: "Current Date: {{date}}" // This template will be replaced with the current date
  },
  {
    tag: "pre",
    classes: "code",
    text: `// Create element from simple brick
  createElements({
      tag: "div",
      text: "Current Date: {{current_date}}"
  });

// Update the current date every 1 second, watch the DOM update!
  setInterval(() => {
    registerData("current_date", new Date().toLocaleString());
  }, 1000);`
  },
  {
    tag: "div",
    classes: "copy",
    text: "This also works within your HTML document."
  },
  {
    tag: "pre",
    classes: "code",
    text: `<h1>{{page_title}}</h1>`
  },
  {
    tag: "div",
    classes: "copy",
    text:
      "The app title at the beginning of this document is a template inside of index.html"
  },
  { tag: "hr" },
  {
    tag: "h2",
    text: "Builder Brick Schema"
  },
  {
    tag: "div",
    classes: "copy",
    text: "Builder parses objects of 'Bricks' into HTML Elements."
  },
  {
    tag: "div",
    classes: "code",
    children: [
      { tag: "div", text: "{" },
      {
        tag: "ul",
        children: createPropertyList(BUILDER_PROPS_EXAMPLE)
      },
      { tag: "div", text: "}" }
    ]
  },
  {
    tag: "div",
    text:
      "The above schema was generated via an array of arbitrary objects mapped to Builder bricks.",
    classes: "copy"
  },
  {
    tag: "pre",
    classes: "code",
    text: `  const BUILDER_PROPS = [
    {
      property: "tag {string}",
      description: "The desired html element to build"
    },
    {
      property: "text {string}",
      description: "Content to fill the html element with"
    },
    {
      property: "classes {string}",
      description: "CSS class string to attach to this element"
    },
    {
      property: "attrs {array}",
      description: "HTML attributes to attach to this element"
    },
    {
      property: "children {array}",
      description:
        "Descriptions of further elements to build as children to this element"
    }
  ];

  const createListItem = item => ({
    tag: "li",
    children: [
      {
        tag: "pre",
        text: item.property
      },
      { tag: "p", text: item.description }
    ]
  });

  const createPropertyList = props => props.map(createListItem);`
  },
  {
    tag: "div",
    classes: "copy",
    text: "In this way, you can render lists of js data as html pretty easily"
  },
  { tag: "hr" },
  {
    tag: "h2",
    text: "Element Nesting"
  },
  {
    tag: "div",
    text: `The children of this element will be styled, indented, and have uppercase text.`,
    classes: "uppercase copy",
    children: [
      {
        tag: "div",
        text: `
        I have inherited, and explict styling with classes!
        `,
        classes: "indented",
        attrs: [{ name: "class", value: "I get overwritten!" }],
        children: [
          { tag: "p", text: "I am a nested child", classes: "indented" }
        ]
      },
      {
        tag: "p",
        text: `
        I am another child!
        `,
        classes: "indented",
        attrs: [{ name: "class", value: "I get overwritten!" }]
      }
    ]
  },
  {
    tag: "pre",
    classes: "code",
    text: `{
    tag: "div",
    text: "The children of this element will be styled, indented, and have uppercase text.",
    classes: "uppercase copy",
    children: [
      {
        tag: "div",
        text: "I have inherited, and explict styling with classes!",
        classes: "indented",
        attrs: [{ name: "class", value: "I get overwritten!" }],
        children: [
          { tag: "p", text: "I am a nested child", classes: "indented" }
        ]
      },
      {
        tag: "p",
        text: "I am another child!",
        classes: "indented",
        attrs: [{ name: "class", value: "I get overwritten!" }]
      }
    ]
  }`
  }
];

// Setup Builder's scope within the DOM
setRoot(document.getElementById("app"));

// Register some data to replace a template string {{app_name}} inside of index.html
registerData("app_name", "Builder");

// Build our page via the array `DOM`
createElements(DOM);

// Update the date every second to replace a template string
setInterval(() => {
  registerData("date", new Date().toLocaleString());
}, 1000);
