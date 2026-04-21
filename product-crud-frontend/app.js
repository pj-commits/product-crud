const BASE_URL = "http://localhost:8080/api/products";
let currentPage = 0;
let deleteId = null;
let productModal, deleteModal;

document.addEventListener("DOMContentLoaded", () => {
    productModal = new bootstrap.Modal(document.getElementById("productModal"));
    deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
    fetchProducts();
});

async function fetchProducts(page = 0) {
    currentPage = page;
    const keyword = document.getElementById("keywordFilter").value;
    const sortBy = document.getElementById("sortBy").value;
    const sortOrder = document.getElementById("sortOrder").value;
    const pageSize = document.getElementById("pageSize").value;

    const url = `${BASE_URL}?pageIndex=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}&keywordFilter=${keyword}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        renderTable(data.content);
        renderPagination(data.totalPages, data.number, data.totalElements);
    } catch (e) {
        document.getElementById("productTable").innerHTML =
            `<tr><td colspan="6" class="text-center text-danger">Failed to load. Is the backend running?</td></tr>`;
    }
}

function renderTable(products) {
    const tbody = document.getElementById("productTable");
    if (!products || products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-3 text-muted">No products found.</td></tr>`;
        return;
    }
    tbody.innerHTML = products
        .map(
            (p, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${p.title}</td>
        <td>${p.description || "-"}</td>
        <td><span class="badge badge-${p.status}">${formatStatus(p.status)}</span></td>
        <td>${p.pieces ?? "-"}</td>
        <td>
          <button class="btn btn-outline-secondary btn-sm" onclick='openModal(${JSON.stringify(p)})'>Edit</button>
          <button class="btn btn-outline-danger btn-sm" onclick='openDelete(${p.id}, "${p.title}")'>Delete</button>
        </td>
      </tr>
    `,
        )
        .join("");
}

function formatStatus(status) {
    if (!status) return "-";
    return status.replace("_", " ");
}

function renderPagination(totalPages, currentPageNum, totalElements) {
    document.getElementById("pageInfo").textContent =
        `Total: ${totalElements} products`;
    const el = document.getElementById("pagination");
    if (totalPages <= 1) {
        el.innerHTML = "";
        return;
    }

    let html = `<button class="btn btn-outline-secondary btn-sm" onclick="fetchProducts(${currentPageNum - 1})" ${currentPageNum === 0 ? "disabled" : ""}>Prev</button>`;
    for (let i = 0; i < totalPages; i++) {
        html += `<button class="btn btn-sm ${i === currentPageNum ? "btn-primary" : "btn-outline-secondary"}" onclick="fetchProducts(${i})">${i + 1}</button>`;
    }
    html += `<button class="btn btn-outline-secondary btn-sm" onclick="fetchProducts(${currentPageNum + 1})" ${currentPageNum === totalPages - 1 ? "disabled" : ""}>Next</button>`;
    el.innerHTML = html;
}

function openModal(product = null) {
    document.getElementById("formError").classList.add("d-none");
    document.getElementById("productId").value = product ? product.id : "";
    document.getElementById("title").value = product ? product.title : "";
    document.getElementById("description").value = product
        ? product.description || ""
        : "";
    document.getElementById("pieces").value = product
        ? (product.pieces ?? "")
        : "";
    document.getElementById("modalTitle").textContent = product
        ? "Edit Product"
        : "Add Product";
    productModal.show();
}

async function saveProduct() {
    const id = document.getElementById("productId").value;
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const pieces = document.getElementById("pieces").value;
    const errorEl = document.getElementById("formError");

    if (!title) {
        errorEl.textContent = "Title is required.";
        errorEl.classList.remove("d-none");
        return;
    }

    errorEl.classList.add("d-none");

    const body = {
        title,
        description: description || null,
        pieces: pieces !== "" ? parseInt(pieces) : null,
    };

    try {
        const res = await fetch(id ? `${BASE_URL}/${id}` : BASE_URL, {
            method: id ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error();
        productModal.hide();
        fetchProducts(currentPage);
    } catch (e) {
        errorEl.textContent = "Failed to save product.";
        errorEl.classList.remove("d-none");
    }
}

function openDelete(id, name) {
    deleteId = id;
    document.getElementById("deleteProductName").textContent = name;
    deleteModal.show();
}

async function confirmDelete() {
    try {
        await fetch(`${BASE_URL}/${deleteId}`, { method: "DELETE" });
        deleteModal.hide();
        fetchProducts(currentPage);
    } catch (e) {
        alert("Failed to delete.");
    }
}
