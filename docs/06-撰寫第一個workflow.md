# 第 6 章:動手寫第一個 Workflow

> 這一章不講新的理論,而是把本專案真實在用的 [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) 逐行拆解給你看,
> 讓你確認自己真的看得懂一份 workflow 檔案在做什麼。

---

## 6.1 完整內容

這是本專案實際使用的檔案內容:

```yaml
name: CI - 自動測試計算機範例

on:
  push:
    branches: ["main"]
    paths:
      - "examples/calculator/**"
      - ".github/workflows/ci.yml"
  pull_request:
    branches: ["main"]
    paths:
      - "examples/calculator/**"
      - ".github/workflows/ci.yml"

jobs:
  test:
    name: 執行單元測試
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: examples/calculator

    steps:
      - name: 取得程式碼
        uses: actions/checkout@v4

      - name: 設定 Node.js 環境
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: 安裝套件
        run: npm install

      - name: 執行測試
        run: npm test
```

---

## 6.2 逐段拆解

### `name:` —— 這個 workflow 的顯示名稱

```yaml
name: CI - 自動測試計算機範例
```

這只是給人看的名字,會顯示在 GitHub 網頁的 Actions 分頁上,方便你分辨這是哪一個自動化流程。

### `on:` —— 什麼時候要觸發

```yaml
on:
  push:
    branches: ["main"]
    paths:
      - "examples/calculator/**"
      - ".github/workflows/ci.yml"
  pull_request:
    branches: ["main"]
    paths:
      - "examples/calculator/**"
      - ".github/workflows/ci.yml"
```

這段的意思是:

- 當有人 **推送(push)** 程式碼到 `main` 分支,**而且**改動的檔案落在 `examples/calculator/` 資料夾
  或是這份 workflow 檔案本身時,才會觸發。
- 當有人針對 `main` 分支 **開啟或更新 Pull Request**,符合同樣的檔案條件時,也會觸發。

`paths` 這個設定很實用:它讓 workflow **只在相關檔案被改動時才執行**,
如果你只是改了 [`docs/`](../docs) 資料夾裡的教學文字,就不需要浪費資源重新跑一次計算機測試。

### `jobs:` —— 要執行的工作

```yaml
jobs:
  test:
    name: 執行單元測試
    runs-on: ubuntu-latest
```

- `test` 是這個 job 的內部代號(你可以自己取名字)。
- `runs-on: ubuntu-latest` 表示這個 job 要在「最新版的 Ubuntu 虛擬機器」上執行。

### `defaults:` —— 設定預設的工作資料夾

```yaml
    defaults:
      run:
        working-directory: examples/calculator
```

因為我們的計算機範例程式放在 `examples/calculator/` 這個子資料夾裡,而不是 repo 的最外層,
這行設定讓底下所有的 `run` 指令,都預設在這個資料夾底下執行,不用每個步驟都重複打路徑。

### `steps:` —— 依序執行的步驟

```yaml
    steps:
      - name: 取得程式碼
        uses: actions/checkout@v4
```

`actions/checkout@v4` 是 GitHub 官方提供的現成步驟,作用是「把這個 repo 目前的程式碼下載到虛擬機器裡」。
**幾乎每一個 workflow 的第一步都會用到這個 action**,因為虛擬機器一開始是空的,什麼程式碼都沒有。

```yaml
      - name: 設定 Node.js 環境
        uses: actions/setup-node@v4
        with:
          node-version: "20"
```

因為計算機範例是用 JavaScript(Node.js)寫的,這一步負責在虛擬機器裡安裝好 Node.js 20 版的執行環境。
`with:` 底下的內容,是傳給這個現成步驟的「參數」,這裡指定了要安裝的版本號。

```yaml
      - name: 安裝套件
        run: npm install
```

執行 `npm install`,自動下載這個範例程式所需要的套件(在這裡是測試工具 Jest)。

```yaml
      - name: 執行測試
        run: npm test
```

最後執行 `npm test`,也就是實際跑測試的指令。如果測試裡有任何一項不通過,
這個指令就會回傳「失敗」,GitHub 就會把整個 workflow 標記為失敗,並且清楚地在網頁上顯示是哪一步出錯。

---

## 6.3 一個小技巧:`uses` 跟 `run` 的差別

| 關鍵字 | 意思 | 範例 |
|--------|------|------|
| `uses:` | 使用別人已經寫好的現成步驟(Action) | `uses: actions/checkout@v4` |
| `run:` | 直接執行一行終端機指令 | `run: npm test` |

大部分常見、通用的需求(取得程式碼、設定程式語言環境、部署到某個平台)都已經有現成的 Action 可以用,
不需要自己重新寫一套邏輯。GitHub 有一個叫做 [GitHub Marketplace](https://github.com/marketplace?type=actions)
的地方,收錄了非常多社群貢獻的現成 Action。

---

## 6.4 如何親眼確認它真的有在跑?

1. 前往本專案的 [Actions 分頁](https://github.com/flin1206/ci-cd-tutorial/actions)。
2. 你會看到一筆一筆的執行紀錄,每一筆都對應到一次程式碼的推送。
3. 點進任何一筆紀錄,可以看到 `test` 這個 job,底下依序展開每一個 step 的詳細執行紀錄(log)。
4. 如果某個 step 前面顯示打勾符號,代表這步驟成功;顯示叉叉符號,代表這步驟失敗,
   點開來還可以看到詳細的錯誤訊息。

---

## 6.5 小結

- 一份 workflow 檔案由 `name`、`on`、`jobs`、`steps` 組成,層層往下拆解。
- `paths` 設定可以讓 workflow 只在相關檔案改動時才觸發,避免浪費資源。
- `uses` 用來呼叫現成的步驟,`run` 用來執行終端機指令。

接下來我們要更深入地看第三步跟第四步「安裝套件」與「執行測試」背後,測試程式碼實際上是怎麼運作的。
前往 [第 7 章:在 CI 裡面做自動測試](./07-在CI中測試.md)。
