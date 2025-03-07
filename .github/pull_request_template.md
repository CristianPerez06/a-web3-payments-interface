## Requirements

<!-- Change each checkbox to [x] to mark it as checked. -->

- [ ] I have validated that the folder structure for new components follows the established guidelines:
  ```
  - my-cool-feature
    - index.ts
    - my-cool-feature.tsx
    - components
      - my-cool-component
        - index.ts
        - my-cool-component.tsx
    - hooks
      - index.ts
      - use-my-cool-hook.ts
    - types
      - index.ts
    - utils
      - index.ts
  ```
- [ ] I have validated that I've used Functional components and declared all props in an interface, avoiding the use of the FC type:
  ```
  interface MyCoolComponentProps {
    prop1: string;
    prop2: number;
  }
  const MyCoolComponent = ({ prop1, prop2 }: MyCoolComponentProps) => {
    return <div>{prop1}</div>;
  };
  ```
- [ ] I have validated that every API call is made using a hook along with react-query.
- [ ] I have validated that the component, hook, type, function, etc., I've added does not already exist in the project.
- [ ] I have validated that I've avoided the use of `any` types, except where it was extremely difficult to do otherwise.
- [ ] I have validated that I've avoided using memoing hooks like useCallback and useMemo, unless they were absolutely necessary.
