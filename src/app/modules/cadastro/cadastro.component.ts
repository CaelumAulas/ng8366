import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpResponseBase } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'cmail-cadastro',
  templateUrl: './cadastro.component.html',
  styles: [`
    .mdl-grid {
      flex-direction: column;
    }

  `]
})
export class CadastroComponent implements OnInit {

  formCadastro = new FormGroup({
    nome: new FormControl('', Validators.required),
    username: new FormControl('', [Validators.required, Validators.minLength(2)]),
    senha: new FormControl('', [Validators.required, Validators.minLength(4)]),
    avatar: new FormControl('', Validators.required, this.validaImagem.bind(this)),
    telefone: new FormControl('', [Validators.required, Validators.pattern('[0-9]{4}-?[0-9]{4}[0-9]?')]),
  })

  msgErro = '';

  constructor(private http: HttpClient
              ,private servico: UserService
              ,private roteador: Router) {}

  ngOnInit() {}

  validaImagem(controle: FormControl){

    const urlInvalida = {urlInvalida: true}

    return this.http
                .head(controle.value,{observe: 'response'})
                .pipe(
                  map((resposta: HttpResponseBase) => {

                    if(resposta.headers.get('Content-Type').includes('image')){
                      return resposta.ok
                    } else {
                      return urlInvalida
                    }

                  })
                  , catchError(() => [urlInvalida])
                )

  }

  cadastrar(){

    if(this.formCadastro.invalid){
      this.formCadastro.markAllAsTouched();
      console.error('formulário invalidoo preencha tudoooo');
      return
    }

    this.servico
        .cadastrar(this.formCadastro.value)
        .subscribe(
         (userOutput) => this.roteador.navigate(['login', userOutput.username])
         ,erro => this.msgErro = `${erro.statusText}: Oops algo errado aconteceu tente mais tarde. ${erro.status}`
        );

  }

}