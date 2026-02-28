# 📄 Invoicely — Smart Invoicing & Effortless Business Management 🚀

Welcome to **Invoicely**, a powerful, user-friendly platform designed for modern businesses. From **invoices to e-way bills**, **product catalogs to vendor lists**, everything is organized in one seamless dashboard — helping you build professionalism, maintain compliance, and scale your brand effortlessly.

Whether you're handling **a single business or managing multiple companies**, Invoicely offers the flexibility and control you need — without the complexity.

---

## 💡 Why Invoicely?

Because billing shouldn’t feel like a chore.  
Invoicely transforms paperwork into productivity with:

✅ Automated invoice creation  
✅ Seamless GST & e-way bill generation  
✅ Multi-company management from a single login  
✅ Professionally branded documents  
✅ Secure and searchable record-keeping

---

## 🛠️ Core Features

| Module                           | Description                                                            |
| -------------------------------- | ---------------------------------------------------------------------- |
| 🧾 **Invoices & Sales Bills**    | Generate GST-compliant invoices in seconds with professional templates |
| 🚚 **E-Way Bill Integration**    | Create and manage transport documents efficiently                      |
| 📦 **Product / Service Catalog** | Maintain stock details with pricing, taxes, and unit tracking          |
| 🧑‍🤝‍🧑 **Vendors & Customers**       | Centralized contact management for suppliers and buyers                |
| 🧑‍💼 **Multi-Company Management**  | Users can switch and operate between multiple registered companies     |
| 📊 **Reports & Analytics**       | View insights on sales, dues, and growth metrics _(coming soon)_       |

---

## 🧠 Who Is It For?

- 🏢 Small & Medium Enterprises
- 🛒 Retailers & Wholesalers
- 🚛 Transport & Logistics Providers
- 📦 Manufacturing & Trading Firms
- 🧑‍💻 Freelancers & Service Providers

---

## 🗂️ Nx Monorepo Folder Structure

```bash
/INVOICELY  # Nx Monorepo Root

├── apps/
│   ├── server/          # Backend Application (NestJS)
│   │   └── src/
│   │       ├── app.module.ts
│   │       ├── main.ts
│   │       └── modules/           # Feature Modules
│   │           ├── invoice/
│   │           │   ├── invoice.controller.ts
│   │           │   ├── invoice.service.ts
│   │           │   ├── invoice.module.ts
│   │           │   └── dto/
│   │           │       ├── create-invoice.dto.ts
│   │           │       └── update-invoice.dto.ts
│   │           ├── product/
│   │           ├── vendor/
│   │           ├── eway-bill/
│   │           └── company/
│   ├── web/         # Frontend Application (Next.js, In Progress)
│   │   └── src/
│   │       └── ...
│
├── libs/ or shared/                # Shared modules (utilities, DTOs, interfaces, constants)
│   ├── constants/
│   ├── types/
│   └── utils/
│   └── api-interfaces/
│   └── interfaces/
│
├── nx.json
├── workspace.json
├── package.json
└── tsconfig.base.json
```

```bash
🔧 Tech Stack
| Layer            | Tech Used                                                        |
| ---------------- | ---------------------------------------------------------------- |
| Backend          | NestJS (Node.js + TypeScript), MongoDB for database              |
| Frontend         | Next.js (React framework, setup-in-progress)                           |
| Monorepo Tooling | Nx Workspace for project orchestration and shared libraries      |
| Shared Logic     | `shared` folder for DTOs, utility functions, and interfaces, components, styles |
```

```bash
🚀 Development Setup

# Install dependencies
pnpm install

# Run backend app
nx serve server

# Run frontend app (once available)
nx dev web

# Generate new module/service/controller for backend
nx g @nrwl/nest:module <module-name> --project=server
nx g @nrwl/nest:controller <controller-name> --project=server
nx g @nrwl/nest:service <service-name> --project=server
⚠️ Make sure your MongoDB instance is running and .env variables are set for database connection.
```

## 🤝 Contributing

Invoicely is continuously evolving.

This is an Open-Source repository, and contributions are always welcome! If you find an issue, please create a new issue under the "Issues" section. To contribute code, fork the repository and submit a pull request. Your contributions will help make this a valuable resource for the community!

1. Fork the repository
2. Create a new branch: git checkout -b feature/my-feature
3. Make your changes
4. Commit your changes: git commit -am 'Add new feature'
5. Push to the branch: git push origin feature/my-feature
6. Open a Pull Request

## ✨ Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <>
      <td align="center">
        <a href="https://github.com/omjpatel586">
          <img src="https://avatars.githubusercontent.com/u/119939918?v=4&s=100" width="100" alt="Om J Patel"/>
          <br />
          <b>Om J Patel</b>
        </a>
        <br />
        <a href="https://github.com/omjpatel586/Invoicely/commits?author=omjpatel586" title="Code">💻</a>
        <a href="#data-omjpatel586" title="Data">🔣</a>
        <a href="#content-omjpatel586" title="Content">🖋</a>
        <a href="https://github.com/omjpatel586/Invoicely/commits?author=omjpatel586" title="Documentation">📖</a>
        <a href="#ideas-omjpatel586" title="Ideas, Planning, & Feedback">🤔</a>
        <a href="#maintenance-omjpatel586" title="Maintenance">🚧</a>
        <a href="#research-omjpatel586" title="Research">🔬</a>
      </td>
      <td align="center">
        <a href="https://github.com/chetannada">
          <img src="https://avatars.githubusercontent.com/u/83969719?v=4&s=100" width="100" alt="Chetan Nada"/>
          <br />
          <b>Chetan Nada</b>
        </a>
        <br />
        <a href="https://github.com/omjpatel586/Invoicely/commits?author=chetannada" title="Code">💻</a>
        <a href="#ideas-chetannada" title="Ideas, Planning, & Feedback">🤔</a>
        <a href="#research-chetannada" title="Research">🔬</a>
        <a href="#design-chetannada" title="Design">🎨</a>
        <a href="#content-chetannada" title="Content">🖋</a>
      </td>
    </tr>

  </tbody>
</table>

## 🤝 Let's Connect

[![linkedin](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/om-j-patel/)
