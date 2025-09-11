# TypeScript 实用技巧

## 类型断言

```typescript
// 类型断言的两种语法
const someValue: unknown = "this is a string";
const strLength1: number = (someValue as string).length;
const strLength2: number = (<string>someValue).length;
```

## 联合类型

```typescript
type Status = "loading" | "success" | "error";

function handleStatus(status: Status) {
  switch (status) {
    case "loading":
      return "正在加载...";
    case "success":
      return "加载成功！";
    case "error":
      return "加载失败！";
  }
}
```

## 泛型

```typescript
function identity<T>(arg: T): T {
  return arg;
}

// 使用
const output1 = identity<string>("myString");
const output2 = identity<number>(100);
```

## 实用工具类型

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Partial - 所有属性变为可选
type PartialUser = Partial<User>;

// Pick - 选择特定属性
type UserInfo = Pick<User, "name" | "email">;

// Omit - 排除特定属性
type UserWithoutId = Omit<User, "id">;
```

这些技巧可以帮助你更好地使用 TypeScript！
