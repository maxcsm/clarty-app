import { Injectable } from '@angular/core';
//import { Configuration, OpenAI } from 'openai';

import { catchError } from 'rxjs/operators';
import { throwError, Observable, } from 'rxjs';
import { retry, } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {


  apiKeyData:any= "sk-proj-mDr45NyFajXqHhCJP0A2cZ0zbedszjKE5fdLTpqeac-0YWURKQAOF0q55llxqAzIehHY8bMuLpT3BlbkFJom2zSGF_sGQ-pJEefeWXCF2lMdU6iOf8Mo7whRxwfNg6914B3wA";
  //private openai: OpenAIApi;
  private baseUrl = 'https://api.openai.com/v2';
  fullText: string = ''; // Le texte complet, avec retour à la ligne après chaque point.
  buffer: string = '';
  count: number = 1;

  constructor(private http: HttpClient) {

  }



  async streamChatCompletion(prompt: string, onData: (token: string) => void): Promise<void> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKeyData}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        //threadId:  "thread_Jqx17Uc2eOj2tJpZDAB7z1PR",
        stream: true,
      }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder('utf-8');

    if (!reader) return;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const dataStr = line.replace('data: ', '');
          if (dataStr === '[DONE]') break;

          const data = JSON.parse(dataStr);
          const token = data.choices?.[0]?.delta?.content;
          if (token) {
            onData(token); // stream each token to UI
          }
        }
      }
    }
  }



  async streamChatCompletionAllChat(prompt: string, onData: (token: string) => void): Promise<void> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKeyData}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        //threadId:  "thread_Jqx17Uc2eOj2tJpZDAB7z1PR",
        stream: true,
      }),
    });

    console.log(response); 
    const reader = response.body?.getReader();
    console.log(reader); 
    const decoder = new TextDecoder('utf-8');
    if (!reader) return;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

 
      //const lines = chunk.split('\n').filter(line => line.trim() !== '');
      const lines = chunk.split('\n').filter(line => line.trim() !== '');
      for (const line of lines) {


  
        console.log(line ); 
        if (line.startsWith('data: ')) {
          const dataStr = line.replace('data: ', '');
          if (dataStr === '[DONE]') break;
          // const data = JSON.parse(dataStr);
         const data =JSON.parse(dataStr);
         const token = data?.delta?.content?.[0]?.text?.value;
          if (token) {
            onData(token);
          } 
        }
      }  
    }
  }




///////////////////////////////////////////////
  async createThread(): Promise<string> {
    const res = await fetch(`${this.baseUrl}/threads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKeyData}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    return data.id; // thread_id
  }






  async sendMessageToThread(threadId: string, message: string): Promise<void> {
    await fetch(`${this.baseUrl}/threads/${threadId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKeyData}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role: 'user',
        content: message,
      }),
    });
  }



  async streamThreadResponse(
    threadId: string,
    assistantId: string,
    vectorStoreId: string,
    userInput: string,
    onData: (token: string) => void
  ): Promise<void> {


      var newstr = vectorStoreId.replace("\n", ""); 
      const arrVector = [newstr];
    const response = await fetch('https://api.openai.com/v1/threads/runs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKeyData}`,
        'Content-Type': 'application/json',
       // 'Access-Control-Allow-Origin': '*',
         'OpenAI-Beta': 'assistants=v2'
       },
       body: JSON.stringify({
         temperature:0.11,
         top_p:1,
         model: "gpt-4o-mini",
         assistant_id:assistantId,
         thread: {
          messages: [
            {"role": "user", "content": userInput}
          ],
          tool_resources: { file_search: 
                          { vector_store_ids:arrVector}},
        },
        tool_choice:{"type": "file_search"},
        stream: false,
      }),
    });


    console.log(response); 
    const reader = response.body?.getReader();
    console.log(reader); 
    const decoder = new TextDecoder('utf-8');
    if (!reader) return;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

 
      //const lines = chunk.split('\n').filter(line => line.trim() !== '');
      const lines = chunk.split('\n').filter(line => line.trim() !== '');
      for (const line of lines) {


  
        console.log(line ); 
        if (line.startsWith('data: ')) {
          const dataStr = line.replace('data: ', '');
          if (dataStr === '[DONE]') break;
          // const data = JSON.parse(dataStr);
         const data =JSON.parse(dataStr);
         const token = data?.delta?.content?.[0]?.text?.value;
          if (token) {
            onData(token);
          } 
        }
      }  
    }

  }




  async streamThreadQuestion(
    threadId: string,
    assistantId: string,
    vectorStoreId: string,
    userInput: string,
    onData: (token: string) => void
  ): Promise<void> {


      var newstr = vectorStoreId.replace("\n", ""); 
      const arrVector = [newstr];
    const response = await fetch('https://api.openai.com/v1/threads/runs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKeyData}`,
        'Content-Type': 'application/json',
       // 'Access-Control-Allow-Origin': '*',
         'OpenAI-Beta': 'assistants=v2'
       },
       body: JSON.stringify({
         temperature:0.11,
         top_p:1,
         model: "gpt-4o-mini",
         assistant_id:assistantId,
         thread: {
          messages: [
            {"role": "user", "content": userInput}
          ],
          tool_resources: { file_search: 
                          { vector_store_ids:arrVector}},
        },
        tool_choice:{"type": "file_search"},
        stream: true,
      }),
    });


    const reader = response.body?.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
  
    while (true) {
      const { value, done } = await reader!.read();
      if (done) break;
  
      buffer += decoder.decode(value, { stream: true });
  
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // conserve la ligne incomplète
  
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.replace('data: ', '').trim();
  
          if (jsonStr === '[DONE]') {
            console.log('✅ Stream terminé.');
            break;
          }
  
          try {
            const parsed = JSON.parse(jsonStr);
            console.log('📦 Donnée parsée :', parsed);
  
            const token = parsed?.delta?.content?.[0]?.text?.value;
             if (token) {
               onData(token);
             } 
            // ici tu peux afficher dans l’UI (ex: this.messages.push(parsed))
          } catch (err) {
            console.warn('⚠️ JSON invalide :', jsonStr);
          }
        }
      }
    }


  }





  async streamThreadSaveQuestion(
    threadId: string,
    assistantId: string,
    vectorStoreId: string,
    userInput: string,
    onData: (token: string) => void
  ): Promise<void> {


      var newstr = vectorStoreId.replace("\n", ""); 
      const arrVector = [newstr];
    const response = await fetch('https://api.openai.com/v1/threads/'+threadId+'/runs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKeyData}`,
        'Content-Type': 'application/json',
       // 'Access-Control-Allow-Origin': '*',
         'OpenAI-Beta': 'assistants=v2'
       },
       body: JSON.stringify({
         temperature:0.11,
         top_p:1,
         model: "gpt-4o-mini",
         assistant_id:assistantId,
        additional_messages:[
          {"role": "user", "content": userInput}
        ],
        tool_choice:{"type": "file_search"},
        stream: true,
      }),
    });


    console.log(response); 





    const reader = response.body?.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
  
    while (true) {
      const { value, done } = await reader!.read();
      if (done) break;
  
      buffer += decoder.decode(value, { stream: true });
  
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // conserve la ligne incomplète
  
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.replace('data: ', '').trim();
  
          if (jsonStr === '[DONE]') {
            console.log('✅ Stream terminé.');
            break;
          }
  
          try {
            const parsed = JSON.parse(jsonStr);
            console.log('📦 Donnée parsée :', parsed);
  
            const token = parsed?.delta?.content?.[0]?.text?.value;
             if (token) {
               onData(token);
             } 
            // ici tu peux afficher dans l’UI (ex: this.messages.push(parsed))
          } catch (err) {
            console.warn('⚠️ JSON invalide :', jsonStr);
          }
        }
      }
    }
  }




  async streamThreadSaveQuestionWithoutFile(
    threadId: string,
    assistantId: string,
    userInput: string,
    onData: (token: string) => void
  ): Promise<void> {


    const response = await fetch('https://api.openai.com/v1/threads/'+threadId+'/runs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKeyData}`,
        'Content-Type': 'application/json',
       // 'Access-Control-Allow-Origin': '*',
         'OpenAI-Beta': 'assistants=v2'
       },
       body: JSON.stringify({
         temperature:0.11,
         top_p:1,
         model: "gpt-4o-mini",
         assistant_id:assistantId,
        additional_messages:[
          {"role": "user", "content": userInput}
        ],
        stream: true,
      }),
    });


    console.log(response); 





    const reader = response.body?.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
  
    while (true) {
      const { value, done } = await reader!.read();
      if (done) break;
  
      buffer += decoder.decode(value, { stream: true });
  
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // conserve la ligne incomplète
  
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.replace('data: ', '').trim();
  
          if (jsonStr === '[DONE]') {
            console.log('✅ Stream terminé.');
            break;
          }
  
          try {
            const parsed = JSON.parse(jsonStr);
            console.log('📦 Donnée parsée :', parsed);
  
            const token = parsed?.delta?.content?.[0]?.text?.value;
             if (token) {
               onData(token);
             } 
            // ici tu peux afficher dans l’UI (ex: this.messages.push(parsed))
          } catch (err) {
            console.warn('⚠️ JSON invalide :', jsonStr);
          }
        }
      }
    }
  }


  async createVector_stores() {
    const res = await fetch('https://api.openai.com/v1/vector_stores', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKeyData}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    return data.id; // thread_id
  }


  async updateVectorStoreFile(vector_store_id:any, file_id:any): Promise<string> {
    const res = await fetch('https://api.openai.com/v1/vector_stores/'+vector_store_id+'/files/'+file_id, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKeyData}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        attributes: { role: 'user'},
        }),
    });
    const data = await res.json();

    console.log(data); 
    return data.id; // thread_id
  }



  async attachFileToVectorStore(vector_store_id:any, file_id:any): Promise<string> {
    const res = await fetch('https://api.openai.com/v1/vector_stores/'+vector_store_id+'/file_batches', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKeyData}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file_ids: [file_id]
        }),
    });
    const data = await res.json();

    console.log(data); 
    return data.id; // thread_id
  }




   async listVectorStoreFiles(vector_store_id:any) {
  
      const url = 'https://api.openai.com/v1/vector_stores/'+vector_store_id+'/files';
    
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.apiKeyData}`,
          },
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log('Files in vector store:', data.data);
    
        // Use the files (example: update UI, store in variable)
        return data.data;
      } catch (error) {
        console.error('Error fetching vector store files:', error);
      }
    }



    async  deleteVectorStoreFile(vector_store_id:any, fileId: string) {
      const apiKey = 'YOUR_OPENAI_API_KEY';
    
      const url = 'https://api.openai.com/v1/vector_stores/'+vector_store_id+'/files/'+fileId;
    
      try {
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.apiKeyData}`,
          },
        });
    
        if (!response.ok) {
          throw new Error(`Failed to delete file. Status: ${response.status}`);
        }
    
        const result = await response.json();
        console.log('✅ File deleted:', result);
        return result;
      } catch (error) {
        console.error('❌ Error deleting file:', error);
      }
    }



    async  saveFileMetadata(fileId: string) {
      const metadata = {
        fileId,
        username: 'Example File',
        customName: 'Example File',
        tags: ['tag1', 'tag2'],
        description: 'This file contains important data.',
        createdAt: new Date().toISOString(),
      };
    
      // Save the metadata in your database (e.g., Firebase, MongoDB)
      // This example assumes you're saving to a local API or service.
      await fetch('https://your-database-api.com/metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata),
      });
    
      console.log('Custom metadata saved for file:', fileId);
    }





  // Function to get file content from OpenAI's file API
async getFileContent(fileId: string): Promise<string> {

  const url = `https://api.openai.com/v1/files/${fileId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${this.apiKeyData}`,
    },
  });

  const data = await response.json();
  return data.content; // Assuming content is available in the file metadata
}


    async findAuthorInFile(fileId: string) {
      // Step 1: Get the file content

      console.log(fileId); 
      const fileContent = await this.getFileContent(fileId);
    
      // Step 2: Use OpenAI to detect the author's name from the file content
      const query = `Quel est le titre ?\n\n${fileContent}`;
      

      const url = 'https://api.openai.com/v1/completions';
    
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKeyData}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Using OpenAI’s powerful GPT model
          prompt: query,
          max_tokens: 100,  // You can adjust the max tokens as needed
          temperature: 0.5,  // Adjust temperature for creativity (lower is more focused)
        }),
      });
    
      const data = await response.json();
     // const result = data.choices[0].text.trim();
    
    
      return data  // This will print the author's name or text indicating where to find it
    }


  // Fetch file (PDF) from an external URL
  fetchFile(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });
  }

  // Upload the PDF to OpenAI's server
  uploadFileToOpenAI(pdfBlob: Blob, fileName: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', pdfBlob, fileName);



    return this.http.post('https://api.openai.com/v1/files', formData, {
      headers: {
        'Authorization': `Bearer ${this.apiKeyData}`,
      },
    });
  }


}