import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, QueryList, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import Swal from 'sweetalert2';

type Product = {
  idProduct: string;
  nameProduct: string;
  slugProduct: string;
  nameCategory: string;
  slugCategory: string;
  nameBrand: string;
  slugBrand: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'frontend';
  urlApi: String = 'http://127.0.0.1:8000/api/';
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  actualForEdit: Product = {} as Product;
  @ViewChild('content', { static: false }) modalTemplate: TemplateRef<any> = {} as TemplateRef<any>;

  constructor(private modal: NgbModal, private http: HttpClient) {
    this.dtOptions = {
      ajax: {
        url: this.urlApi + 'products/other/table',
        type: 'GET'
      },
      columns: [
        { data: 'nameProduct' },
        { data: 'slugProduct' },
        { data: 'nameCategory' },
        { data: 'slugCategory' },
        { data: 'nameBrand' },
        { data: 'slugBrand' },
        { data: 'creationProduct' },
        { data: 'actions' },
      ],
      order: [
        [6, 'desc']
      ],
      pagingType: 'full_numbers',
      columnDefs: [
        {
          targets: 7,
          render: function (data: any, type: any, full: any, meta: any) {
            return `<center>
                        <div class="btn-toolbar justify-content-center" role="toolbar" aria-label="Toolbar with button groups">
                            <div class="btn-group" role="group" aria-label="First group">
                                <button type="button"  id="edit_product"   item="${full._id}" class="btn btn-xs btn-primary btn-icon edit_product"><i class="icon-nd fas fa-edit"></i></button>
                                <button type="button"  id="delete_product" item="${full._id}" class="btn btn-xs btn-danger  btn-icon delete_product"><i class="icon-nd fas fa-trash"></i></button>
                             </div>
                        </div>
                     </center>`;
          }
        }
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        $('.edit_product', row).off('click');
        $('.edit_product', row).on('click', () => {
          self.handleEditProductEvent(data);
        });

        $('.delete_product', row).off('click');
        $('.delete_product', row).on('click', () => {
          self.handleDeleteProductEvent(data);
        });
        return row;
      }
    };

  }

  onSubmit = (form: NgForm) => {
    let dataForm = form.value;
    let data = {
      name: dataForm['name-product'],
      slug: dataForm['slug-product'],
      category: {
        name: dataForm['name-category'],
        slug: dataForm['slug-category'],
      },
      brand: {
        name: dataForm['name-brand'],
        slug: dataForm['slug-brand'],
      }
    };
    console.log({ data });

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.post('http://127.0.0.1:8000/api/products', JSON.stringify(data), { headers }).subscribe((resp: any) => {
      console.log(resp);
      if (resp.status == 200) {
        Swal.fire({
          title: 'Se registró el producto correctamente',
          text: resp.msg,
          icon: 'success'
        });
        this.reloadTable();
      }
      else {
        Swal.fire({
          title: 'Error al ingresar el producto',
          text: resp.msg,
          icon: 'error'
        });
      }
    });

  }

  /*
   * Manejar el evento de editar producto en cada fila de Datatable
   * @param { Object } data
   */
  handleEditProductEvent = (data: any) =>  {
    let item = data._id;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.get('http://127.0.0.1:8000/api/products/' + item, { headers }).subscribe((resp: any) => {
      let data = resp.data;
      this.actualForEdit.nameProduct =  data.name;
      this.actualForEdit.slugProduct =  data.slug;
      this.actualForEdit.nameCategory = data.category.name;
      this.actualForEdit.slugCategory = data.category.slug;
      this.actualForEdit.nameBrand = data.brand.name;
      this.actualForEdit.slugBrand = data.brand.slug;
      this.showModalForm(this.modalTemplate);
    });
    console.log('HandleEditProductEvent: ', item);
  }

  /*
   * Manejar el evento de eliminar producto en cada fila de Datatable
   * @param { Object } data
   */
  handleDeleteProductEvent = (data: any) =>  {
    let item = data._id;
    Swal.fire({
      title: "¿Desea eliminar este producto?",
      text: "Esta acción es irrevesible",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        return fetch(this.urlApi + 'products/' + item, {
          method: 'DELETE'
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(response.statusText);
            }
            return response.json();
          })
          .catch((error) => {
            Swal.showValidationMessage(
              `Request failed: ${error}`
            );
          });
      }
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          title: 'Producto eliminado',
          text: 'El producto se ha eliminado correctamente.',
          icon: 'success'
        });
        this.reloadTable();
      }
    })
    console.log('HandleDeleteProductEvent: ', item);
  }

  reloadTable = () => {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  showModalForm = (content: any) => {
    this.modal.open(content, { size: 'lg' });
  }

  closeModalForm = () => {
    this.modal.dismissAll('Saliendo');
    this.clearDataOfEditProduct();
  }

  clearDataOfEditProduct = () => {
    this.actualForEdit = {} as Product;
  }
}
