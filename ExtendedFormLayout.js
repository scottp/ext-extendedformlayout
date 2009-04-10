/* lib/ilode/ExtendedFormLayout.js */

// Features:
//		- Allow for "comments" to be added
//		- Automatic lookup of alternative 'title' and 'comment' fields
// New fields:
//		- CurrentForm.pageName = is the name to use in Help
//		- CurrentField.fieldComment = Comment for the current field
//      - CurrentField.commentLeft = Offset from left default = 500
// TODO:
//		- Automatically add tips and other help parts !

Ext.layout.ExtendedFormLayout = Ext.extend(Ext.layout.FormLayout, {
    setContainer : function(ct){
        Ext.layout.ExtendedFormLayout.superclass.setContainer.call(this, ct);

            // the default field template used by all form layouts
            var t = new Ext.Template(
                '<div class="x-form-item {5}" tabIndex="-1">',
                    '<label for="{0}" style="{2}" class="x-form-item-label">{1}{4}</label>',
                    '<div class="x-form-element" id="x-form-el-{0}" style="{3}"></div>',
                    '<div class="x-form-comment" style="{8}">{7}</div>',
                    '<div class="{6}"></div>',
                '</div>'
            );
            t.disableFormats = true;
            t.compile();
            Ext.layout.ExtendedFormLayout.prototype.fieldTpl = t;
			this.pageName = ct.pageName;
    },

    // private
    renderItem : function(c, position, target){
		var name = c.name;
		if (c.commentName != undefined) {
			name = c.commentName;
		}
        if(c && !c.rendered && (c.isFormField || c.isFormSpecial) && c.inputType != 'hidden'){

			// Field comment - override in Help
			var fieldComment = c.fieldComment || '';
			if (Ilode.help.editor[this.pageName] && Ilode.help.editor[this.pageName]['comment'] && Ilode.help.editor[this.pageName]['comment'][name]) {
				fieldComment = Ilode.help.editor[this.pageName]['comment'][name];
			}

			// Field label - override in Help (also note Seperator)
			var fieldLabel = c.fieldLabel;
			if (Ilode.help.editor[this.pageName] && Ilode.help.editor[this.pageName]['label'] && Ilode.help.editor[this.pageName]['label'][name]) {
				fieldLabel = Ilode.help.editor[this.pageName]['label'][name];
			}

			// Support automatic seperator change - only if currently ":"
			var labelSeparator = typeof c.labelSeparator == 'undefined' ? this.labelSeparator : c.labelSeparator;
			if (labelSeparator == ':' && fieldLabel && fieldLabel.substr(-1, 1) == '?') {
				fieldLabel = fieldLabel.substr(0,fieldLabel.length - 1);
				labelSeparator = '?';
			}

			// Position of left of comments
			// 	Counld consider calcualted default ?
			var commentLeft = c.commentLeft || 500;
			if ( (fieldComment == undefined) || (fieldComment == '') ) {
				// Attempt to hide comments if they are not used.
				commentLeft = 1;
			}

            var args = [
                   c.id, 
				   fieldLabel,
                   c.labelStyle||this.labelStyle||'',
                   this.elementStyle||'',
                   labelSeparator,
                   (c.itemCls||this.container.itemCls||'') + (c.hideLabel ? ' x-hide-label' : ''),
                   c.clearCls || 'x-form-clear-left',
                   fieldComment,
				   'left:' + commentLeft + 'px;'
            ];
            if(typeof position == 'number'){
                position = target.dom.childNodes[position] || null;
            }
            if(position){
                this.fieldTpl.insertBefore(position, args);
            }else{
                this.fieldTpl.append(target, args);
            }
            c.render('x-form-el-'+c.id);
        }else {
            Ext.layout.FormLayout.superclass.renderItem.apply(this, arguments);
        }
    }

});

Ext.Container.LAYOUTS['form'] = Ext.layout.ExtendedFormLayout;
