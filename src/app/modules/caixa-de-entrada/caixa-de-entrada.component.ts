import { Component, OnInit } from '@angular/core';
import { Email } from '../../models/email';
import { NgForm } from '@angular/forms';
import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'cmail-caixa-de-entrada',
  templateUrl: './caixa-de-entrada.component.html',
  styles: []
})
export class CaixaDeEntradaComponent implements OnInit {

  private _isEmailOpen = false;
  listaEmails = [];

  email: Email = new Email({destinatario: '', assunto: '', conteudo: ''});

  constructor(private servico: EmailService) { }

  ngOnInit() {
    this.carregarEmails();
  }

  carregarEmails(){
    this.servico
        .carregar()
        .subscribe(
          listaEmailsApi => this.listaEmails = listaEmailsApi
          ,erro => console.log(erro)
        )
  }

  get isEmailOpen(){
    return this._isEmailOpen;
  }

  toggleEmailForm(){
    this._isEmailOpen = !this.isEmailOpen
  }

  enviarEmail(formEmail: NgForm){

    if(formEmail.invalid){
      formEmail.controls['para'].markAsTouched();
      formEmail.controls['assunto'].markAsTouched();
      return
    }

    this.servico
        .enviar(this.email)
        .subscribe(
          () => {
            this.carregarEmails();
            formEmail.resetForm();
            this.toggleEmailForm();
          }
          , erro => console.log(erro)
        )

  }

}
