import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FeedbackService } from '../services/feedback.service'
import { Feedback, ContactType } from '../shared/feedback';
import { flyInOut, expand } from '../animations/app.animations';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
	styleUrls: ['./contact.component.scss'],
	host: {
		'[@flyInOut]': 'true',
		'style': 'display: block;'
	},
	animations: [
		flyInOut(),
		expand()
	]
})
export class ContactComponent implements OnInit {

	feedbackForm: FormGroup;
	feedback: Feedback;
	fdb: Feedback;
	contactType = ContactType;
	errMess: string;

	formErrors = {
		'firstname': '',
		'lastname': '',
		'telnum': '',
		'email': '',
	};

	validationMessages = {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
	};

	constructor(private fb: FormBuilder,
		private feedbackservice: FeedbackService) {
		this.createForm();
	}

  ngOnInit() {
	}
	
  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      telnum: ['', [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contacttype: 'None',
      message: ''
		});
		
		this.feedbackForm.valueChanges
			.subscribe(data => this.onValueChange(data));

		this.onValueChange(); //(re)set validation message now
	}
	
	onValueChange(data?: any) {
		if(!this.feedbackForm) {
			return;
		}

		const form = this.feedbackForm;
		for(const field in this.formErrors){
			this.formErrors[field] = '';
			const control = form.get(field);
			if(control && control.dirty && !control.valid) {
				const message = this.validationMessages[field];
				for(const key in control.errors) {
					this.formErrors[field] += message[key] + ' ';
				}
			}
		}
	}

  onSubmit() {
		this.feedback = this.feedbackForm.value;
		console.log(this.feedback);

		document.getElementsByTagName('form')[0].style.display = 'none';

		this.feedbackservice.submitFeedback(this.feedback)
		.subscribe((feedback) => {
			this.fdb = feedback;
			setInterval(() =>{
				delete this.fdb;
				document.getElementsByTagName('form')[0].style.display = 'block';
			}, 5000);
		}, errmess => this.errMess = errmess);

    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
  }
}
