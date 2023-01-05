import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  dtOptions: DataTables.Settings = {};

  constructor(private modal: NgbModal, private http: HttpClient) {
    this.dtOptions = {
      ajax: {
        url: 'http://127.0.0.1:8000/api/products/other/table',
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
      pagingType: 'full_numbers',
      columnDefs: [
        {
          targets: 7,
          render: function (data: any, type: any, full: any, meta: any) {
            const btn_accion = full.estado == 2 ? { active: 'fas fa-check', color: 'success' } : { active: 'fas fa-ban', color: 'warning' };
            return `<center>
                                <div class="btn-toolbar justify-content-center" role="toolbar" aria-label="Toolbar with button groups">
                                    <div class="btn-group" role="group" aria-label="First group">
                                        <button type="button" id="edit_cargo" item="${full.id_cargo}" class="btn btn-xs btn-primary  btn-icon"><i class="icon-nd fas fa-edit"></i></button>
                                        <button type="button" id="delete_cargo" item="${full.id_cargo}" class="btn btn-xs btn-danger btn-icon"><i class="icon-nd fas fa-trash"></i></button>
                                        <button type="button" status="${full.estado_cargo}" id="ban_cargo" item="${full.id_cargo}" class="btn btn-xs btn-${btn_accion.color} btn-icon"><i class="icon-nd ${btn_accion.active}"></i></button>
                                        </div>
                                </div>
                            </center>`;
          }
        }
      ],
    }
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

  showModalForm = (content: any) => {
    this.modal.open(content, { size: 'lg' });
  }


}
