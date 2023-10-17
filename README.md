# MoonChute

React Hook for Account Abstraction

## Documentation

Please visit [moonchute](https://docs.moonchute.xyz/) for full documentation

## Install

install moonchute and its dependency

```shell
npm install moonchute
```

## Quick Start

Get smart accounts owned by `address` with moonchute

```typescript
import { MoonChuteConfig, createMoonChuteConfig } from 'moonchute'


const config = createMoonChuteConfig({
  apiKey: <YOUR_MOONCHUTE_API_KEY>,
});

function App() {
  return (
    <MoonChuteConfig config={config}>
      <SmartAccounts />
    </MoonChuteConfig>
  )
}
```

```typescript
import { useSmartAccounts } from "moonchute";

export default function SmartAccounts() {
  const { data } = useSmartAccounts({
    address: "0x6136b647C9971f1EDc7641e14a9E0Ca7b2626080",
    chainId: 137,
  });

  if (data) {
    return (
      <div>
        {data.smartAccount?.map((sa, key) => (
          <div
            key={key}
          >{`Address: ${sa.address} / Provider: ${sa.provider}`}</div>
        ))}
      </div>
    );
  }
}
```
