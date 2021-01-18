<template>
  <div>
    <div
      id="profile"
      v-if="
        $store.state.isAdminLoggedIn && $store.state.admin.actor == 'supper'
      "
    >
      <v-form
        enctype="multipart/form-data"
        class="pa-10"
        id="adminRegistrationPageLayout"
        v-model="isValidityChecked"
      >
        <p class="text-center grey--text">Account Management</p>
        <br />
        <p class="green--text text-center">{{ adminUpdateSuccess }}</p>
        <p class="red--text text-center">{{ adminUpdateError }}</p>
        <div class="text-center">
          <v-avatar size="120" color="grey">
            <input
              type="file"
              class="mb-10 input-file"
              ref="image"
              @change="selectFile"
              accept="image/*"
            />
            <v-img v-if="imagePreview" conatain :src="imagePreview" alt="Image"
              ><input
                type="file"
                class="mb-10 input-file"
                ref="image"
                @change="selectFile"
                accept="image/*"
            /></v-img>

            <v-img
              v-if="adminPicture && imagePreview == ''"
              :src="require(`../../../../server/images/${adminPicture}`)"
              contain
            >
              <input
                type="file"
                class="mb-10 input-file"
                ref="image"
                @change="selectFile"
                accept="image/*"
            /></v-img>
          </v-avatar>
        </div>

        <v-layout row wrap class="pt-4" justify-space-around>
          <v-flex xs12 md5>
            <v-text-field
              :rules="nameValidation"
              label="First Name"
              prepend-icon="person"
              v-model="firstName"
              class="ma-3"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md5>
            <v-text-field
              :rules="nameValidation"
              label="Middle Name"
              prepend-icon="person"
              v-model="middleName"
              class="ma-3"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md5>
            <v-text-field
              :rules="nameValidation"
              label="Last Name"
              prepend-icon="person"
              v-model="lastName"
              class="ma-3"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md5>
            <v-text-field
              :rules="phoneValidation"
              label="Phone Number"
              prepend-icon="phone"
              v-model="phoneNumber"
              class="ma-3"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md5>
            <v-text-field
              :rules="addressValidation"
              label="Address"
              prepend-icon="add"
              v-model="address"
              class="ma-3"
            ></v-text-field>
          </v-flex>

          <v-flex xs12 md4>
            <v-btn
              text
              dark
              class="green pr-10 pl-10 ma-5"
              @click="updateProfile"
              :loading="loading"
            >
              <span class="text-capitalize">Save</span>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-form>
    </div>
    <p class="text-center red--text" v-else>You don't have access'</p>
  </div>
</template>

<script>
import apiService from "../../services/apiService";
export default {
  data() {
    return {
      adminUpdateSuccess: "",
      adminUpdateError: "",
      isValidityChecked: false,
      adminImageBinary: "",
      firstName: "",
      middleName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      imagePreview: "",
      adminPicture: "",

      loading: false,

      imageURL: "",
      nameValidation: [
        (input) =>
          /^[a-zA-Z ]{2,32}$/.test(input) ||
          "Invalid name. it contains a-z or A-Z, with minimum 2 characters and maximum 32 characters",
      ],
      phoneValidation: [
        (input) =>
          /^[+]{1}[0-9]{12,13}$/.test(input) ||
          "Invalid phone number. it contains country code and followed by phone number",
      ],
      addressValidation: [
        (input) =>
          /^[a-zA-Z0-9 .]{2,32}$/.test(input) ||
          "Invalid address. it contains a-z" + ",A-Z, 0-9, , and . ",
      ],
    };
  },
  methods: {
    selectFile() {
      this.adminImageBinary = this.$refs.image.files[0];
      const image = this.adminImageBinary;
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.imagePreview = e.target.result;
      };
    },
    async updateProfile() {
      if (this.isValidityChecked) {
        this.loading = true;
        const formData = new FormData();
        formData.append("img", this.adminImageBinary);
        try {
          if (this.imagePreview) {
            const ImageResponse = await apiService.uploadImage(formData);
            this.imageURL = ImageResponse.data.imageUrl;
          } else this.imageURL = this.adminPicture;

          const updateResult = await apiService.updateProfile({
            _id: this.$store.state.admin._id,
            firstName: this.firstName,
            middleName: this.middleName,
            lastName: this.lastName,
            phoneNumber: this.phoneNumber,
            address: this.address,
            adminPicture: this.imageURL,
            from: this.$store.state.admin.actor,
          });

          this.$store.dispatch("setAdmin", updateResult.data.admin);
          this.$store.dispatch("setAdminToken", updateResult.data.adminToken);
          this.loading = false;
          this.adminUpdateError = "";
          this.adminUpdateSuccess = "Profile updated successfully!";

          window.scrollTo(0, 0);
        } catch (error) {
          this.loading = false;
          this.adminUpdateSuccess = "";
          if (error.response) {
            if (error.response.data.error == 0) {
              this.$store.dispatch("setAdmin", "");
              this.$store.dispatch("setAdminToken", "");
              this.$store.dispatch("setSession", false);
              this.$router.push({ name: "adminLoginPage" });
            } else {
              this.adminUpdateError = error.response.data.error;
              window.scrollTo(0, 0);
            }
          } else this.adminUpdateError = "Connection to server failed";
        }
      } else {
        window.scrollTo(0, 0);
        this.adminUpdateSuccess = "";
        this.adminUpdateError = "Please fill all the requirements";

        window.scrollTo(0, 0);
      }
      setTimeout(() => {
        this.adminUpdateSuccess = "";
        this.adminUpdateError = "";
      }, 8000);
    },
  },
  created() {
    this.firstName = this.$store.state.admin.firstName;
    this.middleName = this.$store.state.admin.middleName;
    this.lastName = this.$store.state.admin.lastName;
    this.phoneNumber = this.$store.state.admin.phoneNumber;
    this.address = this.$store.state.admin.address;
    this.adminPicture = this.$store.state.admin.adminPicture;
  },
};
</script>
<style  scoped>
#profile {
  max-width: 600px;
  margin: auto;
}

#adminRegistrationForm {
  font-family: sans-serif;
}
#helpBtn {
  float: right;
  clear: right;
}
.input-file {
  opacity: 0;
  position: absolute;
  height: 50px;
  width: 130px;
  cursor: pointer;
}
#imageUploadBox {
  width: 130px;
  height: 50px;
  border-radius: 6px;
}
</style>